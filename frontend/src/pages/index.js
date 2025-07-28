import Layout from '../components/Layout/Navbar';
import PetList from '../components/Pets/PetList';

export default function Home() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Bem-vindo ao VetSaaS</h1>
        <PetList />
      </div>
    </Layout>
  );
}