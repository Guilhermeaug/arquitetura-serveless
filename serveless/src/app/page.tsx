'use client';

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
  image: string;
};

export default function Home() {
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

  async function generateAvatar() {
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}?seed=${seed}&style=${style}`;
    const image = (await fetch(endpoint, {
      method: 'POST',
    }).then((res) => res.json())) as Response;
    setImages([...images, image.image]);
  }

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

        <Flex
          direction={'row'}
          gap={'9'}
          style={{
            marginTop: '2rem',
          }}
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
        </Flex>
        <Button onClick={generateAvatar}>Gerar Avatar</Button>

        <Grid columns={'3'} gap={'3'} width={'auto'} mt={"4"}>
          {images.map((image, index) => {
            const [style, seed] = image.split(':');
            return (
              <Image
                key={index}
                src={`https://api.dicebear.com/7.x/${style}/png?seed=${seed}`}
                alt="avatar"
                width={128}
                height={128}
              />
            );
          })}
        </Grid>
      </Flex>
    </Container>
  );
}
