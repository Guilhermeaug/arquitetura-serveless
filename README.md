# Arquitetura Serveless

## Participantes

- Guilherme Augusto de Oliveira (20213006564)
- Pedro Veloso Inácio de Oliveira (20213004837)
- Victor Samuel Levindo Mont’Mor (20213005191)
- Yasmim Augusta Gomes (20213002082)

O site está disponível [aqui](https://arquitetura-serveless.vercel.app/).

## Descrição

Neste roteiro, você vai colocar em prática os conceitos de de Arquitetura Serverless que é um modelo de computação em nuvem que permite criar e executar aplicações sem precisar se preocupar com a infraestrutura subjacente. Em termos simples, é como alugar um espaço na internet para hospedar e executar o seu software sem ter que se preocupar com a manutenção dos servidores.

No modelo serverless, você não precisa se preocupar em gerenciar os servidores. Você simplesmente carrega o seu código (como pequenas funções ou pedaços de software) para um provedor de serviços em nuvem,e esses provedores cuidam de todo o trabalho de infraestrutura, como gerenciamento de servidores, escala automática e alocação de recursos.

O código fornecido é um exemplo de uma aplicação web que utiliza a arquitetura serverless para criar avatares de forma dinâmica. Nele, todas as funcionalidades foram desenvolvidas com recursos sem servidor. A plataforma Vercel é responsável por hospedar o site, fornecer um banco de dados e também gerenciar as funções serverless, que são basicamente pequenos pedaços de código que são executados em um servidor remoto.

## Instalação

É necessário ter, no mínimo, a versão 18 do Node.js instalada em sua máquina. Para verificar a versão do Node.js, execute o comando abaixo no terminal:

```bash
node -v
```

Caso não tenha o Node.js instalado, você pode baixar a versão mais recente [aqui](https://nodejs.org/en/).

Crie uma nova pasta para o projeto e inicie um novo projeto NextJS com o comando:

```bash
npx create-next-app
```

Escolha um nome para o projeto e mantenha todas as opções padrões.

Após a criação do projeto, instale as dependências necessárias:

```bash
npm install
```

## Execução

Abra a pasta do projeto no VSCode e execute o comando abaixo para iniciar o servidor:

```bash
npm run dev
```

Acesse o endereço [http://localhost:3000](http://localhost:3000) para visualizar o projeto.

Abra um novo terminal e instale as seguintes dependências:

```bash
npm install @radix-ui/themes @vercel/kv
```

## Criando a página de avatares

### Limpando o CSS

Abra o arquivo `src/globals.css` e remova todo o conteúdo. Em seguida, adicione o seguinte código:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Criando o layout

Abra o arquivo `src/layout.tsx` e importe o seguinte componente, que inclui uma estilização básica para o projeto utilizando o RadixUI. Para saber mais sobre o RadixUI, acesse a [documentação](https://www.radix-ui.com/themes/docs/overview/getting-started).

```jsx
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
```

a função RootLayout deve ficar da seguinte forma:

```jsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Theme>{children}</Theme>
      </body>
    </html>
  );
}
```

### Criando um vetor estático

As imagens geradas pelo site são regidas por alguns temas que o usuário pode escolher. Para incluir os temas como opção na página, crie um arquivo `src/app/dicebear/options.ts` com o seguinte conteúdo:

```ts
// Dicebear options
export const styles = [
  'adventurer',
  'adventurer-neutral',
  'avataaars',
  'avataaars-neutral',
  'big-ears',
  'big-ears-neutral',
  'bottts',
  'bottts-neutral',
  'thumbs',
  'notionists',
].sort();
```

### Criando a página principal

Abra o arquivo `src/app/page.tsx`. Esse é o ponto de partida de um projeto NextJS. Deixe o retorno da função Home da seguinte forma.

```jsx
return (
  <Container>
    <Flex direction="column" gap="2" p={'4'}>
      <Text size={'7'}>Exemplo de aplicação Serveless</Text>
      <Text size={'4'}>
        Nela, você conseguirá criar avatares que estarão sincronizados com um
        banco de dados serveless. Além disso, a hospedagem do site também é do
        mesmo tipo, assim como seu pequeno backend.
      </Text>
      <Text>
        As imagens são geradas pelo serviço{'  '}
        <a href="https://avatars.dicebear.com/">
          https://avatars.dicebear.com/
        </a>
      </Text>

      <form onSubmit={generateAvatar}>
        <Flex
          direction={'row'}
          gap={'6'}
          style={{
            marginTop: '2rem',
          }}
          align={'center'}
        >
          <Flex direction={'column'} gap={'2'}>
            <Text size={'3'}>Selecione o tipo do avatar</Text>
            <Select.Root
              value={style}
              onValueChange={(value) => setStyle(value)}
            >
              <Select.Trigger variant="soft" />
              <Select.Content variant={'solid'}>
                <Select.Group>
                  <Select.Label>Estilos</Select.Label>
                  {styles.map((style) => (
                    <Select.Item key={style} value={style}>
                      {style}
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </Flex>
          <Flex direction={'column'} gap={'2'}>
            <Text size={'3'}>
              Escolha um texto de semente para gerar um avatar aleatório
            </Text>
            <TextFieldInput
              placeholder="Ex. avatar1"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
            />
          </Flex>
          <Button>Gerar Avatar</Button>
          <Button color="red" type="button" onClick={clearImages}>
            Limpar avatares
          </Button>
        </Flex>
      </form>

      <Grid
        columns={{
          initial: '2',
          md: '4',
          lg: '5',
        }}
        gap={'4'}
        mt={'4'}
        justify={'center'}
        align={'center'}
        position={'relative'}
      >
        {images.map((image, index) => {
          const [style, seed] = image.split(':');
          return (
            <Image
              key={index}
              src={`https://api.dicebear.com/7.x/${style}/png?seed=${seed}`}
              alt="avatar"
              width={128}
              height={128}
              placeholder="blur"
              blurDataURL={rgbDataURL(237, 181, 6)}
            />
          );
        })}
      </Grid>
    </Flex>
  </Container>
);
```

Alguns erros serão apontados. Importe os seguintes componentes:

```jsx
import Image from 'next/image';
import {
  Flex,
  Text,
  Button,
  TextFieldInput,
  Select,
  Container,
  Grid,
} from '@radix-ui/themes';
import { styles } from './dicebear/options';
import { useEffect, useState } from 'react';

type Response = {
  image: string,
};
```

Adicione o seguinte código antes do retorno da função Home:

```jsx
const [style, setStyle] = useState('adventurer');
  const [seed, setSeed] = useState('');
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    async function fetchImages() {
      const endpoint = process.env.NEXT_PUBLIC_API_URL;
      const images = (await fetch(endpoint!).then((res) =>
        res.json()
      )) as string[];
      setImages(images);
    }
    fetchImages();
  }, []);

  async function generateAvatar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}?seed=${seed}&style=${style}`;
    const image = (await fetch(endpoint, {
      method: 'POST',
    }).then((res) => res.json())) as Response;
    setImages([...images, image.image]);

    setSeed('');
  }

  async function clearImages() {
    const endpoint = process.env.NEXT_PUBLIC_API_URL;
    await fetch(endpoint!, {
      method: 'DELETE',
    });
    setImages([]);
  }
```

A função useEffect puxa os avatares que estão armazenadas no banco de dados. A generateAvatar envia um sinal para o servidor para gerar um novo avatar e a clearImages envia um sinal para o servidor para limpar o banco de dados.

Para que essas funções sejam armazenadas pela Vercel como funções serverless, é necessário criar um arquivo `src/app/api/route.ts` com o seguinte conteúdo:

```ts
import { kv } from '@vercel/kv';

export async function POST(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const style = searchParams.get('style');
  const seed = searchParams.get('seed') || 'default';

  await kv.lpush('dicebear', `${style}:${seed}`);

  return Response.json({
    image: `${style}:${seed}`,
  });
}

export async function GET(request: Request) {
  const images = await kv.lrange('dicebear', 0, -1);
  return Response.json(images);
}

export async function DELETE(request: Request) {
  await kv.del('dicebear');
  return Response.json({
    message: 'success',
  });
}
```

Desse modo, com o servidor hospedado na Vercel, as funções serverless serão executadas remotamente.

Verifique se o código está igual ao do repositório. Em caso positivo, crie um repositório no github e faça o push do código. No site da Vercel, faça o login com a conta do github e importe o repositório. A Vercel irá criar um link para o site. No campo de projetos, selecione o projeto e vá até a aba de storage. Nessa aba inicie um novo banco de dados redis, seguindo o passo a passo descrito.

Caso tudo tenha ocorrido bem, o site estará funcionando e os avatares serão gerados e armazenados no banco de dados.

## Comentários Finais

Em resumo, o código mostra um componente que interage com um serviço serverless para gerar avatares dinâmicos com base nas escolhas do usuário, mantendo a lógica de geração dos avatares e a sincronização dos mesmos com um banco de dados na camada do servidor.

Tudo utilizado no projeto é serveless:
- o serviço de hospedagem do site
- os endpoints criados para o backend
- o banco de dados redis
- o serviço de CI/CD que permite a integração com o github
  
Além disso, vale destacar que existem muitos outros serviços serveless disponíveis, como por exemplo, o serviço de autenticação Auth0, que permite a criação de um sistema de autenticação para o site de forma rápida e segura. Ademais, plataformas de cloud como AWS e Azure possuem uma gama enorme de serviços serverless que podem ser utilizados para criar aplicações complexas.

### Vantagens:

- Arquitetura Serverless: A lógica de processamento para gerar avatares é acionada por demanda, permitindo escalabilidade elástica. Se houver um grande número de solicitações, a arquitetura serverless pode escalar automaticamente para lidar com elas.

- Serverless para Hospedagem e Backend: Ao usar serviços serverless para hospedagem e backend, pode-se reduzir a sobrecarga de gerenciamento e os custos, já que os provedores de nuvem cobram apenas pelos recursos usados durante a execução das funções.

- Implantação e Resposta Rápida: Arquiteturas serverless simplificam o ciclo de desenvolvimento, reduzindo o tempo entre o desenvolvimento e a implantação devido à infraestrutura gerenciada pelo provedor de nuvem.

### Desvantagens:

- Dependência do Provedor de Nuvem: A arquitetura serverless pode criar uma dependência significativa de um provedor de nuvem específico. Mudar para outro provedor pode ser complexo, resultando em um "lock-in" ou dependência excessiva do serviço do provedor.

- Limitações da Arquitetura: As arquiteturas serverless têm limitações quanto à duração das funções, tamanho dos arquivos e outras restrições. Isso pode limitar a complexidade ou tamanho do aplicativo.
