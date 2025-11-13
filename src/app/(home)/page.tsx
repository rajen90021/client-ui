import Image from 'next/image';
import { Button } from '@/components/ui/button';
// import ProductList from './components/product-list';
import { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function Home({ searchParams }: { searchParams: { restaurantId: string } }) {
    return (
        <>
            <section className="bg-white">
                <div className="container flex items-center justify-between py-24">
                    <div>
                        <h1 className="text-6xl font-black font-sans leading-2">
                            Super Delicious Pizza in <br />
                            {/* <span className="text-primary ">Only 45 Minutes!</span> */}
                        </h1>
                        <p className="text-2xl mt-8 max-w-lg leading-snug">
                            Enjoy a Free Meal if Your Order Takes More Than 45 Minutes!
                        </p>
                        <Button className="mt-8 text-lg rounded-full py-7 px-6 font-bold">
                            Get your pizza now
                        </Button>
                    </div>
                    <div>
                        <Image alt="pizza-main" src={'/pizza-main.png'} width={400} height={400} />
                    </div>
                </div>
            </section>
            <section>
                <div className="container py-10">

                    <Tabs defaultValue="pizza" className="w-[400px]">
                        <TabsList>
                            <TabsTrigger value="pizza" className="text-lg">Pizza</TabsTrigger>
                            <TabsTrigger value="burger" className="text-lg">Burger</TabsTrigger>
                        </TabsList>
                        <TabsContent value="pizza">
                            <p>For additional security, confirm your password. Current password cannot be recovered.</p>
                        </TabsContent>
                        <TabsContent value="burger">
                            <p>Change your password at any time. Current password cannot be recovered.</p>
                        </TabsContent>
                    </Tabs>
                    
                </div>
            </section>
         
        </>
    );
}
