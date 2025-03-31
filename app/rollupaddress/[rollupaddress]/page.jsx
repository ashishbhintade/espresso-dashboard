export default async function RollUpAddress({ params }) {
  const { rollupaddress } = await params;
  return <h1>RollUp Address is: {rollupaddress}</h1>;
}
