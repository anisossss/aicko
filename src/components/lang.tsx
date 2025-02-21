import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export const LangSelect = () => {
  const { i18n } = useTranslation();
  const changeLanguage = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
    } catch (error) {
      console.error("Language change failed:", error);
    }
  };
  return (
    <Select
      defaultValue={"fr"}
      onValueChange={(value) => changeLanguage(value)}
    >
      <SelectTrigger className="w-[80px] bg-transparent">
        <SelectValue placeholder="Lang" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="fr">Fr</SelectItem>
        <SelectItem value="en">En</SelectItem>
      </SelectContent>
    </Select>
  );
};
