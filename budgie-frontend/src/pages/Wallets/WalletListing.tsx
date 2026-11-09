import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.tsx';
import { formatCurrency } from '@/lib/formatters.ts';
import { Button } from '@/components/ui/button.tsx';
import { Plus } from 'lucide-react';
import type { ApiWalletListingDTO } from '@/services/types.ts';
import { useEffect, useState } from 'react';
import { toastApiError } from '@/lib/apiErrors.ts';
import WalletService from '@/services/WalletService.ts';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty.tsx';

const SKELETON_ROWS = [0, 1, 2, 3, 4];

export const WalletListing = () => {
  const [wallets, setWallets] = useState<ApiWalletListingDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWallets = async () => {
      try {
        setWallets(await WalletService.getWallets());
      } catch (err) {
        toastApiError(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadWallets();
  }, []);

  return (
    <div>
      <main className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex justify-between">
          <h1 className="flex flex-col gap-1 text-3xl font-extrabold">
            Suas carteiras
          </h1>

          <Button>
            <Plus /> Criar carteira nova
          </Button>
        </div>

        <div className="flex flex-col">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-60">Nome</TableHead>
                <TableHead className="w-160">Descrição</TableHead>
                <TableHead className="w-30">Membros</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="w-px text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                SKELETON_ROWS.map((i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  </TableRow>
                ))}

              {!isLoading &&
                wallets.map((wallet) => (
                  <TableRow key={wallet.id}>
                    <TableCell className="font-medium">{wallet.name}</TableCell>
                    <TableCell>{wallet.description || '—'}</TableCell>
                    <TableCell>
                      {wallet.members
                        .map((member) => `(${member[0]})`)
                        .join(' ')}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(wallet.balance)}
                    </TableCell>
                    <TableCell className="w-px text-center"> ... </TableCell>
                  </TableRow>
                ))}

              {!isLoading && wallets.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5}>
                    <Empty>
                      <EmptyHeader>
                        <EmptyTitle>Nenhuma carteira ainda</EmptyTitle>
                        <EmptyDescription>
                          Clique no botão <b>"+ Criar carteira nova"</b> para
                          criar carteiras para gestão de despesas.
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};
