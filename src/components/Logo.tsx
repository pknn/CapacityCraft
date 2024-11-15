import { useNavigate } from 'react-router-dom';

const Logo = () => {
  const navigate = useNavigate();

  return (
    <div
      className="pl-0 p-4 text-2xl font-bold text-stone-800 cursor-pointer"
      onClick={() => navigate('/')}
    >
      <div className="-mb-2">Capacity</div>
      <div>Craft</div>
    </div>
  );
};

export default Logo;
