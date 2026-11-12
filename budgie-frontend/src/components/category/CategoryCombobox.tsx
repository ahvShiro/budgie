import { Button } from '@/components/ui/button.tsx';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command.tsx';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.tsx';
import { DeleteCategoryDialog } from '@/components/category/DeleteCategoryDialog.tsx';
import { Input } from '@/components/ui/input.tsx';
import { toastApiError } from '@/lib/apiErrors.ts';
import CategoryService from '@/services/CategoryService.ts';
import type {
  ApiCategoryResponseDTO,
  TransactionType,
} from '@/services/types.ts';
import { Check, ChevronsUpDown, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const CATEGORY_COLORS = [
  '2563eb',
  'dc2626',
  'd97706',
  '7c3aed',
  '0891b2',
  'db2777',
  '65a30d',
  '475569',
];

interface CategoryComboboxProps {
  id?: string;
  walletId: number;
  type: TransactionType;
  categories: ApiCategoryResponseDTO[];
  value: number | null;
  onChange: (categoryId: number | null) => void;
  onCreated: (category: ApiCategoryResponseDTO) => void;
  onUpdated: (category: ApiCategoryResponseDTO) => void;
  onDeleted: (category: ApiCategoryResponseDTO) => void;
}

interface CategoryDotProps {
  color: string | null;
}

export const CategoryDot = ({ color }: CategoryDotProps) => (
  <span
    className="size-2.5 shrink-0 rounded-full bg-muted-foreground"
    style={color ? { backgroundColor: `#${color}` } : undefined}
  />
);

export const CategoryCombobox = ({
  id,
  walletId,
  type,
  categories,
  value,
  onChange,
  onCreated,
  onUpdated,
  onDeleted,
}: CategoryComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    useState<ApiCategoryResponseDTO | null>(null);

  const selected = categories.find((c) => c.id === value);
  const trimmedSearch = search.trim();

  const canCreate =
    trimmedSearch.length > 0 &&
    !categories.some(
      (c) => c.name.toLowerCase() === trimmedSearch.toLowerCase()
    );

  const handleOpenChange = (nextOpen: boolean) => {
    if (isCreating || isSaving) return;
    if (!nextOpen) {
      setSearch('');
      setEditingId(null);
    }
    setOpen(nextOpen);
  };

  const handleSelect = (categoryId: number | null) => {
    onChange(categoryId);
    handleOpenChange(false);
  };

  const handleCreate = async () => {
    setIsCreating(true);

    try {
      const created = await CategoryService.createCategory(walletId, {
        name: trimmedSearch,
        transactionType: type,
        color:
          CATEGORY_COLORS[Math.floor(Math.random() * CATEGORY_COLORS.length)],
      });
      onCreated(created);
      onChange(created.id);
      setSearch('');
      setOpen(false);
    } catch (err) {
      toastApiError(err);
    } finally {
      setIsCreating(false);
    }
  };

  // Os botões ficam dentro do CommandItem, então o clique não pode subir pro onSelect
  const startEditing = (
    e: React.MouseEvent,
    category: ApiCategoryResponseDTO
  ) => {
    e.stopPropagation();
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const cancelEditing = () => {
    if (isSaving) return;
    setEditingId(null);
  };

  const handleRename = async (category: ApiCategoryResponseDTO) => {
    const name = editingName.trim();
    if (name.length === 0) {
      toast.error('O nome da categoria não pode ficar vazio');
      return;
    }
    if (name === category.name) {
      setEditingId(null);
      return;
    }

    setIsSaving(true);

    try {
      // PUT exige o objeto inteiro, só o nome muda aqui
      const updated = await CategoryService.updateCategory(
        walletId,
        category.id,
        {
          name,
          transactionType: category.transactionType,
          color: category.color,
          icon: category.icon,
          active: true,
        }
      );
      onUpdated(updated);
      setEditingId(null);
    } catch (err) {
      toastApiError(err);
    } finally {
      setIsSaving(false);
    }
  };

  // Enter/setas sobem até o <Command> e ele selecionaria o item destacado
  const handleEditKeyDown = (
    e: React.KeyboardEvent,
    category: ApiCategoryResponseDTO
  ) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRename(category);
    }
  };

  const handleDeleteClick = (
    e: React.MouseEvent,
    category: ApiCategoryResponseDTO
  ) => {
    e.stopPropagation();
    setCategoryToDelete(category);
  };

  const handleDeleted = (category: ApiCategoryResponseDTO) => {
    if (category.id === value) onChange(null);
    onDeleted(category);
  };

  return (
    <>
      <Popover open={open} onOpenChange={handleOpenChange} modal>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            <span className="flex items-center gap-2 truncate">
              {selected ? (
                <>
                  <CategoryDot color={selected.color} />
                  {selected.name}
                </>
              ) : (
                <span className="text-muted-foreground">Sem categoria</span>
              )}
            </span>
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-(--radix-popover-trigger-width) p-0"
          align="start"
          onEscapeKeyDown={(e) => {
            // Esc durante a edição só cancela ela, sem fechar o popover
            if (editingId !== null) {
              e.preventDefault();
              cancelEditing();
            }
          }}
        >
          <Command>
            <CommandInput
              placeholder="Buscar ou criar categoria..."
              value={search}
              onValueChange={setSearch}
              disabled={isCreating}
            />
            <CommandList>
              <CommandGroup>
                <CommandItem
                  value="Sem categoria"
                  data-checked={value === null}
                  onSelect={() => handleSelect(null)}
                >
                  <span className="text-muted-foreground">Sem categoria</span>
                </CommandItem>
                {categories.map((category) =>
                  category.id === editingId ? (
                    // Fora do CommandItem pra não ser selecionável enquanto edita
                    <div
                      key={category.id}
                      className="flex items-center gap-2 px-2 py-1"
                    >
                      <CategoryDot color={category.color} />
                      <Input
                        autoFocus
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => handleEditKeyDown(e, category)}
                        disabled={isSaving}
                        className="h-7"
                        aria-label="Nome da categoria"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        disabled={isSaving}
                        onClick={() => handleRename(category)}
                        aria-label="Salvar"
                      >
                        <Check />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        disabled={isSaving}
                        onClick={cancelEditing}
                        aria-label="Cancelar edição"
                      >
                        <X />
                      </Button>
                    </div>
                  ) : (
                    <CommandItem
                      key={category.id}
                      value={category.name}
                      data-checked={category.id === value}
                      onSelect={() => handleSelect(category.id)}
                    >
                      <CategoryDot color={category.color} />
                      <span className="flex-1 truncate">{category.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={(e) => startEditing(e, category)}
                        aria-label={`Editar ${category.name}`}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        className="hover:text-destructive"
                        onClick={(e) => handleDeleteClick(e, category)}
                        aria-label={`Deletar ${category.name}`}
                      >
                        <Trash2 />
                      </Button>
                    </CommandItem>
                  )
                )}
              </CommandGroup>
              {canCreate && (
                <CommandGroup forceMount>
                  <CommandItem
                    forceMount
                    value={`__criar__${trimmedSearch}`}
                    disabled={isCreating}
                    onSelect={handleCreate}
                  >
                    <Plus />
                    {isCreating ? 'Criando...' : `Criar "${trimmedSearch}"`}
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <DeleteCategoryDialog
        walletId={walletId}
        category={categoryToDelete}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
        onDeleted={handleDeleted}
      />
    </>
  );
};
