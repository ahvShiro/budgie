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

// Mock até o backend ter WalletController. Membros guardam o nome, a inicial é derivada na hora de renderizar
const MOCK_WALLETS = [
  {
    id: 1,
    name: 'Pessoal',
    description: 'Gastos do dia a dia',
    members: ['Arthur'],
    balance: 1842.5,
  },
  {
    id: 2,
    name: 'Casa',
    description: 'Aluguel, contas e mercado dividido',
    members: ['Arthur', 'Beatriz'],
    balance: 3270.0,
  },
  {
    id: 3,
    name: 'Viagem Floripa',
    description: 'Vaquinha da viagem de fim de ano',
    members: ['Arthur', 'Beatriz', 'Carlos', 'Diana'],
    balance: 1150.75,
  },
  {
    id: 4,
    name: 'Reserva de emergência',
    description: '',
    members: ['Arthur'],
    balance: 8500.0,
  },
  {
    id: 5,
    name: 'República',
    description: 'Internet e faxina',
    members: ['Arthur', 'Eduardo', 'Felipe'],
    balance: -120.4,
  },
];

export const WalletListing = () => {
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
              {MOCK_WALLETS.map((wallet) => (
                <TableRow key={wallet.id}>
                  <TableCell className="font-medium">{wallet.name}</TableCell>
                  <TableCell>{wallet.description || '—'}</TableCell>
                  <TableCell>
                    {wallet.members.map((member) => `(${member[0]})`).join(' ')}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(wallet.balance)}
                  </TableCell>
                  <TableCell className="w-px text-center"> ... </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};
