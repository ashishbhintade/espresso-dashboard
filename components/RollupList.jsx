import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

const RollupList = ({ data }) => {
  if (!data || !data.Arguments || !Array.isArray(data.Arguments)) {
    return <div className="text-red-500">No data available</div>;
  }

  // console.log(data, "data from list");

  return (
    <ScrollArea className="h-155 w-full rounded-md border p-4">
      <ul className="space-y-2">
        {data.Arguments.map((item, index) => (
          <li key={index} className="p-2 font-bold">
            {item.Name.replace(/([A-Z])/g, " $1")
              .trim()
              .replace(/\b\w/g, (char) => char.toUpperCase())}{" "}
            : <span className="font-normal">{item.Value.address}</span>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
};

export default RollupList;

{
  /* <Card key={index} className="p-2 shadow-sm">
  <div className="font-semibold">
    {item.Name.replace(/([A-Z])/g, " $1")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase())}
  </div>
  <div className="text-sm text-gray-500">{item.Value.address}</div>
</Card>; */
}
