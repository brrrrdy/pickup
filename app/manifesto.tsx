import { View } from "react-native";
import manifesto from "../content/manifesto.json";
import PageShell, {
  PageShellBody,
  PageShellIntro,
} from "../components/layout/PageShell";
import HandshakeIcon from "../assets/images/handshake_200dp_E3E3E3_FILL0_wght400_GRAD0_opsz48.svg";

export default function Manifesto() {
  const content = manifesto.en;

  return (
    <PageShell>
      <PageShellBody className="items-center gap-8">
        <View className="w-full items-center">
          <HandshakeIcon
            width={200}
            height={200}
            className="text-greenaccent"
          />
        </View>

        <PageShellIntro
          title={content.header}
          body={content.body}
          className="items-center"
          titleClassName="w-full text-center"
          bodyClassName="w-full max-w-2xl self-center text-center"
        />
      </PageShellBody>
    </PageShell>
  );
}
