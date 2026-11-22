import firewallOriginal from "../../../content/redes-parcial-3-2026/assets/originales-completas/foto-11-firewall-completa-original.jpg";
import netstatOriginal from "../../../content/redes-parcial-3-2026/assets/originales-completas/foto-08-netstat-completa-original.jpg";
import routeOriginal from "../../../content/redes-parcial-3-2026/assets/originales-completas/foto-12-show-ip-route-completa-original.jpg";
import tftpOriginal from "../../../content/redes-parcial-3-2026/assets/originales-completas/foto-02-tftp-completa-original.jpg";
import nslookupOriginal from "../../../content/redes-parcial-3-2026/assets/originales-completas/foto-14-nslookup-completa-original.jpg";

import firewallEnhanced from "../../../content/redes-parcial-3-2026/assets/mejoradas/foto-11-firewall-telnet-origen-22-mejorada.jpg";
import tftpEnhanced from "../../../content/redes-parcial-3-2026/assets/mejoradas/foto-02-tftp-recorte-31-mejorada.jpg";

import firewallReconstruction from "../../../content/redes-parcial-3-2026/assets/reconstrucciones/reconstruccion-firewall-telnet.svg";
import tftpReconstruction from "../../../content/redes-parcial-3-2026/assets/reconstrucciones/reconstruccion-tftp.svg";
import nslookupReconstruction from "../../../content/redes-parcial-3-2026/assets/reconstrucciones/reconstruccion-nslookup-instagram.svg";
import routePartialReconstruction from "../../../content/redes-parcial-3-2026/assets/reconstrucciones/reconstruccion-show-ip-route-parcial.svg";
import netstatPartialReconstruction from "../../../content/redes-parcial-3-2026/assets/reconstrucciones/reconstruccion-netstat-parcial.svg";
import netstatPracticeVariant from "../../../content/redes-parcial-3-2026/assets/reconstrucciones/netstat-variante-recordada-practica.svg";

export const redesParcial3ImageAssets = {
  "firewall-telnet": {
    original: firewallOriginal,
    enhanced: firewallEnhanced,
    reconstruction: firewallReconstruction
  },
  netstat: {
    original: netstatOriginal,
    reconstruction: netstatPartialReconstruction,
    practiceVariant: netstatPracticeVariant
  },
  "show-ip-route": {
    original: routeOriginal,
    reconstruction: routePartialReconstruction
  },
  tftp: {
    original: tftpOriginal,
    enhanced: tftpEnhanced,
    reconstruction: tftpReconstruction
  },
  "nslookup-instagram": {
    original: nslookupOriginal,
    reconstruction: nslookupReconstruction
  }
};
