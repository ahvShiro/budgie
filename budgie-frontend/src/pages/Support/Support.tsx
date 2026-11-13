import { useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BugIcon,
  MailIcon,
  MessageCircleIcon,
  SearchIcon,
  SearchXIcon,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { SUPPORT_EMAIL, SUPPORT_WHATSAPP } from '@/configs/env';
import { session } from '@/services/session';

type FaqItem = {
  question: string;
  answer: string;
};

type FaqSection = {
  title: string;
  items: FaqItem[];
};

const FAQ_SECTIONS: FaqSection[] = [
  {
    title: 'Conta e senha',
    items: [
      {
        question: 'Esqueci minha senha, e agora?',
        answer:
          'Na tela de login, clique em "Esqueci minha senha" e informe seu e-mail. Você vai receber um link para criar uma nova senha. O link vale por 1 hora e só pode ser usado uma vez.',
      },
      {
        question: 'O link de redefinição diz que expirou',
        answer:
          'Links usados ou com mais de 1 hora são invalidados por segurança. Peça um novo link na tela de recuperação de senha.',
      },
      {
        question: 'Como troco minha senha estando logado?',
        answer:
          'Pelo seu perfil, informando a senha atual e a nova senha duas vezes.',
      },
    ],
  },
  {
    title: 'Carteiras e compartilhamento',
    items: [
      {
        question: 'Como compartilho uma carteira?',
        answer:
          'Na carteira, adicione um membro pelo e-mail que ele usou no cadastro e escolha o papel dele. A pessoa precisa já ter uma conta no Budgie.',
      },
      {
        question: 'Qual a diferença entre Dono, Editor e Leitor?',
        answer:
          'O Dono criou a carteira e gerencia os membros. O Editor lança transações. O Leitor só acompanha. Cada carteira tem um único dono, e ele não pode ser removido nem ter o papel alterado.',
      },
      {
        question: 'Apaguei uma carteira, as transações somem?',
        answer:
          'Sim, as transações dela deixam de aparecer junto com a carteira.',
      },
    ],
  },
  {
    title: 'Transações e categorias',
    items: [
      {
        question: 'Não consigo escolher uma categoria na transação',
        answer:
          'Cada categoria é de receita ou de despesa, e só aparece para transações do mesmo tipo.',
      },
      {
        question: 'Por que não consigo excluir uma categoria?',
        answer:
          'Categorias que já têm transações não podem ser excluídas nem mudar de tipo, para não bagunçar seu histórico.',
      },
    ],
  },
];

const normalize = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const filterSections = (query: string): FaqSection[] => {
  const term = normalize(query.trim());
  if (!term) return FAQ_SECTIONS;

  return FAQ_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) =>
      normalize(`${item.question} ${item.answer}`).includes(term)
    ),
  })).filter((section) => section.items.length > 0);
};

type ContactCardProps = {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
};

const ContactCard = ({ href, icon, title, description }: ContactCardProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="rounded-xl transition-transform hover:-translate-y-0.5"
  >
    <Card className="h-full hover:bg-muted/50">
      <CardHeader>
        <div className="mb-2 text-muted-foreground">{icon}</div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  </a>
);

export const Support = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const isAuthenticated = session.isAuthenticated();
  const sections = filterSections(query);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-10 p-6 py-12">
      <header className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-extrabold">Como podemos ajudar?</h1>
        <p className="text-muted-foreground">
          Procure sua dúvida abaixo ou fale direto comigo.
        </p>
        <InputGroup className="max-w-md">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Ex.: senha, compartilhar, categoria..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </InputGroup>
      </header>

      <section className="flex flex-col gap-8">
        {sections.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchXIcon />
              </EmptyMedia>
              <EmptyTitle>Nenhuma resposta para "{query}"</EmptyTitle>
              <EmptyDescription>
                Tente outra palavra ou use um dos canais abaixo.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          sections.map((section) => (
            <div key={section.title} className="flex flex-col gap-2">
              <h2 className="text-lg font-bold">{section.title}</h2>
              <Accordion type="single" collapsible>
                {section.items.map((item) => (
                  <AccordionItem key={item.question} value={item.question}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-bold">Ainda precisa de ajuda?</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <ContactCard
            href={`mailto:${SUPPORT_EMAIL}`}
            icon={<MailIcon />}
            title="E-mail"
            description={SUPPORT_EMAIL}
          />
          {SUPPORT_WHATSAPP && (
            <ContactCard
              href={`https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent('Olá! Preciso de ajuda com o Budgie.')}`}
              icon={<MessageCircleIcon />}
              title="WhatsApp"
              description="Para dúvidas rápidas"
            />
          )}
          <ContactCard
            href="https://github.com/ahvShiro/budgie/issues/new"
            icon={<BugIcon />}
            title="Reportar um bug"
            description="Abra uma issue no GitHub"
          />
        </div>
      </section>

      <footer className="flex justify-center gap-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Voltar
        </Button>
        <Button
          onClick={() =>
            navigate(isAuthenticated ? '/app/dashboard' : '/login')
          }
        >
          {isAuthenticated ? 'Ir para o dashboard' : 'Ir para o login'}
        </Button>
      </footer>
    </main>
  );
};
