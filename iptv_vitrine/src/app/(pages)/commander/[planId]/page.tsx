import Header from '@/components/shared/header';
import Footer from '@/components/shared/footer';
import { getProductById } from '@/lib/api';
import OrderForm from '@/components/order/order-form';
import { notFound } from 'next/navigation';

interface CommanderPageProps {
  params: {
    planId: string;
  };
}

export default async function CommanderPage({ params }: CommanderPageProps) {
  const planId = parseInt(params.planId, 10);
  if (isNaN(planId)) {
    notFound();
  }

  const product = await getProductById(planId);
  if (!product) {
    notFound();
  }

  return (
    <>
        <Header />
        <main className="pt-40 pb-20">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto">
                  <h1 className="text-3xl font-bold text-center mb-8 gradient-text animate-gradient-text">Finaliser votre commande</h1>
                  <div className="bg-card rounded-2xl p-8 shadow-lg border border-white/10">
                    <div className="mb-6 pb-6 border-b border-white/10">
                      <h2 className="text-xl font-bold">Récapitulatif</h2>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-text-muted">{product.nom}</span>
                        <span className="font-bold text-lg">{parseFloat(product.prix).toFixed(2)} C$</span>
                      </div>
                    </div>
                    <OrderForm product={product} />
                  </div>
                </div>
            </div>
        </main>
        <Footer />
    </>
  );
}