import {faReact,faLinux,faUnity,faPython,faAws} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function getCat(){
    return {
        Web: <FontAwesomeIcon
        icon={faReact}
        size="3x"
      />,
        System:<FontAwesomeIcon
        icon={faLinux}
        size="3x"
      />,
        "Machine learning": <FontAwesomeIcon
        icon={faPython}
        size="3x"
      />,
        Cloud: <FontAwesomeIcon
        icon={faAws}
        size="3x"
      />,
        Game:<FontAwesomeIcon
        icon={faUnity}
        size="3x"
      />,
      };
}