import GraphQLFetcher from "@/components/QueryFetcher";
import Container from "@/components/Container";

export default function Home() {
  return (
    <Container>
      <h1 className="flex place-content-center my-12 text-4xl">
        Espresso Dashboard
      </h1>
      <GraphQLFetcher />
    </Container>
  );
}
