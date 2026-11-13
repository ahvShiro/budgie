import { Button } from '@/components/ui/button.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx';
import { Field, FieldError } from '@/components/ui/field.tsx';
import { Input } from '@/components/ui/input.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { toastApiError } from '@/lib/apiErrors.ts';
import { toFieldErrors, type FieldErrors } from '@/lib/validationErrors.ts';
import { ASSIGNABLE_ROLES, ROLE_LABELS } from '@/lib/walletRoles.ts';
import WalletMemberService from '@/services/WalletMemberService.ts';
import type {
  ApiWalletListingDTO,
  ApiWalletMemberResponseDTO,
  WalletRole,
} from '@/services/types.ts';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  initialValues,
  memberSchema,
  type Fields,
} from './ShareWalletDialog.validation.ts';

const SKELETON_ROWS = [0, 1, 2];

interface ShareWalletDialogProps {
  wallet: ApiWalletListingDTO | null;
  onOpenChange: (open: boolean) => void;
  onChanged: () => void;
}

export const ShareWalletDialog = ({
  wallet,
  onOpenChange,
  onChanged,
}: ShareWalletDialogProps) => {
  const [members, setMembers] = useState<ApiWalletMemberResponseDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fields, setFields] = useState<Fields>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<Fields>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Linha com requisição em andamento, trava só os controles dela
  const [pendingUserId, setPendingUserId] = useState<number | null>(null);

  const walletId = wallet?.id;

  useEffect(() => {
    if (walletId === undefined) return;

    const loadMembers = async () => {
      setIsLoading(true);
      try {
        setMembers(await WalletMemberService.getMembers(walletId));
      } catch (err) {
        toastApiError(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMembers();
  }, [walletId]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (isSubmitting) return;

    if (!nextOpen) {
      setFields(initialValues);
      setFieldErrors({});
    }

    onOpenChange(nextOpen);
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!wallet) return;

    const result = memberSchema.safeParse(fields);

    if (!result.success) {
      setFieldErrors(toFieldErrors<Fields>(result.error));
      return;
    }

    setIsSubmitting(true);

    try {
      const added = await WalletMemberService.addMember(wallet.id, result.data);
      setMembers((prev) => [...prev, added]);
      // Mantém o papel escolhido, quem adiciona várias pessoas costuma usar o mesmo
      setFields((prev) => ({ ...prev, email: '' }));
      toast.success('Membro adicionado com sucesso!');
      onChanged();
    } catch (err) {
      // E-mail sem conta ou que já é membro: o backend manda a mensagem certa
      toastApiError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = async (userId: number, role: WalletRole) => {
    if (!wallet) return;
    setPendingUserId(userId);

    try {
      const updated = await WalletMemberService.updateMemberRole(
        wallet.id,
        userId,
        { role }
      );
      setMembers((prev) =>
        prev.map((m) => (m.userId === userId ? updated : m))
      );
    } catch (err) {
      toastApiError(err);
    } finally {
      setPendingUserId(null);
    }
  };

  const handleRemove = async (userId: number) => {
    if (!wallet) return;
    setPendingUserId(userId);

    try {
      await WalletMemberService.removeMember(wallet.id, userId);
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
      onChanged();
    } catch (err) {
      toastApiError(err);
    } finally {
      setPendingUserId(null);
    }
  };

  return (
    <Dialog open={wallet !== null} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compartilhar carteira</DialogTitle>
          <DialogDescription>
            Adicione pessoas à carteira <b>{wallet?.name}</b>. Elas precisam já
            ter uma conta no Budgie.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Field>
            <div className="flex gap-2">
              <Input
                type="email"
                name="email"
                placeholder="email@exemplo.com"
                autoComplete="off"
                aria-label="E-mail"
                aria-invalid={!!fieldErrors.email}
                disabled={isSubmitting}
                value={fields.email}
                onChange={(e) => {
                  setFields((prev) => ({ ...prev, email: e.target.value }));
                  setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }}
              />
              <Select
                value={fields.role}
                disabled={isSubmitting}
                onValueChange={(role) =>
                  setFields((prev) => ({
                    ...prev,
                    role: role as Fields['role'],
                  }))
                }
              >
                <SelectTrigger className="w-32 shrink-0" aria-label="Papel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASSIGNABLE_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {ROLE_LABELS[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <FieldError
              errors={fieldErrors.email ? [{ message: fieldErrors.email }] : []}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adicionando...' : 'Adicionar'}
            </Button>
          </Field>
        </form>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">Membros</h3>

          {/* Só a lista rola, o formulário fica fixo em cima */}
          <ul className="-mx-2 flex max-h-72 flex-col overflow-y-auto">
            {isLoading &&
              SKELETON_ROWS.map((i) => (
                <li key={i} className="px-2 py-1.5">
                  <Skeleton className="h-9 w-full" />
                </li>
              ))}

            {!isLoading &&
              members.map((member) => {
                // Dono vem da FK da carteira, o backend barra mexer nele
                const isMemberOwner = member.userId === wallet?.ownerId;
                const isPending = pendingUserId === member.userId;

                return (
                  <li
                    key={member.id}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50"
                  >
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium">
                        {member.userName}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {member.userEmail}
                      </span>
                    </div>

                    {isMemberOwner ? (
                      <span className="px-2 text-sm text-muted-foreground">
                        {ROLE_LABELS.OWNER}
                      </span>
                    ) : (
                      <>
                        <Select
                          value={member.role}
                          disabled={isPending}
                          onValueChange={(role) =>
                            handleRoleChange(member.userId, role as WalletRole)
                          }
                        >
                          <SelectTrigger
                            size="sm"
                            className="w-28"
                            aria-label={`Papel de ${member.userName}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ASSIGNABLE_ROLES.map((role) => (
                              <SelectItem key={role} value={role}>
                                {ROLE_LABELS[role]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="hover:text-destructive"
                          disabled={isPending}
                          onClick={() => handleRemove(member.userId)}
                          aria-label={`Remover ${member.userName}`}
                        >
                          <Trash2 />
                        </Button>
                      </>
                    )}
                  </li>
                );
              })}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};
