import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useXtreamContext } from "@/wrappers/UserContext";
import { useNavigate } from "react-router-dom";
import { LangSelect } from "@/components/lang";
import { useTranslation } from "react-i18next";

export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { setAccount } = useXtreamContext();
  const [formType, setFormType] = useState("xtream");
  const [formData, setFormData] = useState({
    playlistName: "AICKO",
    username: "enAWHBHe",
    host: "http://r360.fyi:2103",
    password: "aPQdnzc",
    m3uUrl: "",
  });

  function getUsernameAndHostAndPassFromUrl(url: string): {
    username: string;
    host: string;
    password: string;
  } {
    const urlObj = new URL(url);
    const host = urlObj.origin;
    const username = urlObj.searchParams.get("username") || "";
    const password = urlObj.searchParams.get("password") || "";
    return { username, host, password };
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formType === "xtream") {
      setAccount({
        playlistName: formData.playlistName,
        username: formData.username,
        host: formData.host,
        password: formData.password,
        m3uUrl: "",
      });
      navigate("/home");
    } else {
      const { username, host, password } = getUsernameAndHostAndPassFromUrl(
        formData.m3uUrl
      );
      setAccount({
        playlistName: formData.playlistName,
        username,
        host,
        password,
        m3uUrl: formData.m3uUrl,
      });
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {/* <IPTVPlayer src='http://r360.fyi:2103/enAWHBHe/aPQdnzc/12071' /> */}
      <div className="mb-8">
        <img src="/logo.png" width={250} />
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md ">
        <RadioGroup
          defaultValue="xtream"
          onValueChange={setFormType}
          className="flex justify-center space-x-4 mb-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="xtream" id="xtream" />
            <Label htmlFor="xtream">Xtream Login</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="m3u" id="m3u" />
            <Label htmlFor="m3u">M3U URL</Label>
          </div>

          <LangSelect />
        </RadioGroup>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="playlistName"
            placeholder="Playlist Name"
            value={formData.playlistName}
            onChange={handleInputChange}
            required
          />

          {formType === "xtream" ? (
            <>
              <Input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
              <Input
                type="text"
                name="host"
                placeholder="Host"
                value={formData.host}
                onChange={handleInputChange}
                required
              />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </>
          ) : (
            <Input
              type="text"
              name="m3uUrl"
              placeholder="M3U URL"
              value={formData.m3uUrl}
              onChange={handleInputChange}
              required
            />
          )}

          <Button type="submit" className="w-full">
            {t("submit")}
          </Button>
        </form>
      </div>
    </div>
  );
}
