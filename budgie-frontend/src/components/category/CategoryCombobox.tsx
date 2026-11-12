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
import { toastApiError } from '@/lib/apiErrors.ts';
import CategoryService from '@/services/CategoryService.ts';
import type {
  ApiCategoryResponseDTO,
  TransactionType,
} from '@/services/types.ts';
import { ChevronsUpDown, Plus } from 'lucide-react';
import { useState } from 'react';

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
}: CategoryComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const selected = categories.find((c) => c.id === value);
  const trimmedSearch = search.trim();

  const canCreate =
    trimmedSearch.length > 0 &&
    !categories.some(
      (c) => c.name.toLowerCase() === trimmedSearch.toLowerCase()
    );

  const handleOpenChange = (nextOpen: boolean) => {
    if (isCreating) return;
    if (!nextOpen) setSearch('');
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

  return (
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
              {categories.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.name}
                  data-checked={category.id === value}
                  onSelect={() => handleSelect(category.id)}
                >
                  <CategoryDot color={category.color} />
                  {category.name}
                </CommandItem>
              ))}
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
  );
};
