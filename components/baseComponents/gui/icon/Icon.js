import React, {useEffect} from "react";
import * as PropTypes from "prop-types";


export default function Icon({name, ...rest}) {
  const ImportedIconRef = React.useRef(null);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    setLoading(true);

    const importIcon = async () => {
      try {
        const {default: namedImport} = await import(`../../../../public/icons/${name}.svg`);
        ImportedIconRef.current = namedImport;
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    importIcon();
  }, [name]);

  if (!loading && ImportedIconRef.current) {
    const {current: ImportedIcon} = ImportedIconRef;
    return <ImportedIcon {...rest} />;
  } else
    return null;
}

Icon.propTypes = {
  /**
   * Имя svg-файла
   */
  name: PropTypes.string
};

