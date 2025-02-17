
import { useState } from "react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const items = [
    { id: 1, title: "Item 1", content: "Content for Item 1" },
    { id: 2, title: "Item 2", content: "Content for Item 2" },
    { id: 3, title: "Item 3", content: "Content for Item 3" },
  ];

  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems((prevOpenItems) =>
      prevOpenItems.includes(id)
        ? prevOpenItems.filter((itemId) => itemId !== id)
        : [...prevOpenItems, id]
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Name: John Doe</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id} className="mb-2">
            <Collapsible open={openItems.includes(item.id)}>
              <div className="flex justify-between items-center">
                <span>{item.title}</span>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleItem(item.id)}
                  >
                    {openItems.includes(item.id) ? "Hide" : "Show"}
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <div className="mt-2 p-2 border rounded">
                  {item.content}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
