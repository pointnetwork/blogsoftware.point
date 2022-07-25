import React from 'react';
import Header from '../components/Header';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useLocation } from 'wouter';

const Blog = () => {
  const [, setLocation] = useLocation();

  return (
    <>
      <Header />
      <main className='pb-4 pt-8 mx-auto' style={{ maxWidth: '720px' }}>
        <div
          className='flex items-center opacity-40 cursor-pointer hover:opacity-90 transition-all'
          onClick={() => setLocation('/')}
        >
          <ArrowBackIosNewIcon />
          <span>Back</span>
        </div>
        <h1 className='text-3xl font-bold mt-4'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </h1>
        <div className='w-full h-64 bg-gray-200 my-6'></div>
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae id,
          aut rem non culpa soluta illo laudantium molestiae, molestias,
          necessitatibus quae eos blanditiis aliquam! Nobis ea temporibus a quae
          tempore aut at culpa incidunt voluptatum voluptatem illum dignissimos
          enim voluptas aliquid, iure unde fuga expedita dolore aspernatur
          nostrum quos iste quod deleniti! Enim distinctio minus minima pariatur
          ducimus nostrum nulla quis libero natus! Inventore sequi nihil fuga
          dolor ea amet aliquam placeat voluptates deleniti dolorem temporibus
          architecto tenetur cum corrupti nobis mollitia ducimus omnis iure
          adipisci, nesciunt velit fugit earum. Porro praesentium recusandae
          repudiandae delectus eligendi aliquam doloremque suscipit hic, odio
          facere optio asperiores sed temporibus quam quia rerum minima vitae,
          dolores corrupti illum ratione veritatis? Impedit, temporibus.
          Corporis porro illum veniam placeat asperiores provident tenetur hic
          dolor illo veritatis voluptas aliquid, nostrum modi aliquam autem?
          Inventore nostrum quaerat, ipsum ducimus dolorum consectetur.
          Laboriosam harum, et perspiciatis natus facilis voluptas? Animi eaque
          mollitia iure vel. Laboriosam atque nam possimus reiciendis quaerat,
          sequi vel odio ipsum repellendus voluptatum nulla at doloribus, nihil
          minima excepturi voluptatem quos sit qui itaque quo molestias! Atque
          aspernatur placeat officia labore voluptatem neque! Facere harum quae
          assumenda labore aut eos vitae, voluptates unde ullam, explicabo sunt
          ducimus amet deserunt voluptate repellendus vero corporis maiores.
          Fuga amet magnam saepe ipsa sit, veniam, facilis consequatur deserunt
          eveniet repellendus nisi ab maiores minus, accusamus numquam ut
          assumenda voluptas praesentium commodi illo consequuntur temporibus.
          Eveniet, quidem obcaecati, repellendus dolorem, similique dignissimos
          repellat optio expedita delectus vero dolores nulla suscipit. Aperiam
          excepturi accusamus nam omnis laborum officiis facere vitae nihil
          eaque explicabo modi odit nobis fuga, ullam labore porro ducimus.
          Voluptatibus esse eos animi ipsum quibusdam accusantium eligendi
          accusamus assumenda dolorum, corporis provident, inventore minima sit.
          Repellendus eligendi mollitia minus, incidunt dolorem impedit a.
          Mollitia quod libero autem nam, quaerat distinctio quam a perspiciatis
          explicabo quis quibusdam repudiandae. Dignissimos mollitia aliquam
          reprehenderit, quisquam culpa atque non asperiores beatae omnis nisi,
          voluptatibus modi eius dicta, illo eos eaque blanditiis quo. Libero
          laborum iste laudantium repellendus eaque voluptatem possimus debitis
          eligendi expedita rem amet officiis dolore, perferendis, obcaecati
          maiores ut modi, quibusdam dolores placeat porro hic nam alias esse?
          Modi quis sapiente magnam sit harum quas error cumque in temporibus
          soluta quae explicabo accusamus cupiditate, earum veniam culpa eum hic
          neque tempora. Laboriosam nostrum enim nemo vitae repellat similique
          numquam rem iusto saepe nulla iure temporibus, neque iste fuga magni
          repellendus veritatis eum impedit culpa incidunt, praesentium,
          officiis eos aliquid ipsam? Obcaecati nam id ea est vel accusantium
          ipsum officia adipisci at nostrum maxime iure fuga quod fugiat
          delectus, accusamus doloremque reprehenderit. Minima expedita aliquam,
          cumque deserunt quae, autem deleniti necessitatibus, optio iste
          ratione obcaecati libero dignissimos sapiente debitis quis recusandae
          vero asperiores? Eius, vero aliquam quisquam assumenda quia quam
          provident optio in perspiciatis officiis vitae recusandae minima,
          distinctio animi ipsam harum reprehenderit inventore ducimus dolor.
          Facere tenetur suscipit cupiditate accusantium ipsam accusamus,
          dolorum quibusdam iusto fugiat assumenda quos quam harum! Doloremque
          cupiditate suscipit corporis quae praesentium omnis est veniam rem
          libero natus.
        </div>
      </main>
    </>
  );
};

export default Blog;
