import { ClipLoader } from 'react-spinners';

function Loader() {
    return (
        <ClipLoader
            color={'oklch(70.4% 0.14 182.503)'}
            cssOverride={{ position: 'absolute', top: '50%', left: '50%' }}
        />
    );
}

export default Loader;
