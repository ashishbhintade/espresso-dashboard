import RollupFetcher from "@/components/RollupFetcher";
import Container from "@/components/Container";

export default async function RollUpAddress({ params }) {
  const { txhash } = await params;
  return (
    <Container>
      <h1 className="flex place-content-center my-12 text-4xl">
        Espresso Dashboard
      </h1>
      <RollupFetcher txhash={txhash} />
    </Container>
  );
}
