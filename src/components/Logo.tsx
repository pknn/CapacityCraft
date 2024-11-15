import { useNavigate } from 'react-router-dom';

const Logo = () => {
  const navigate = useNavigate();

  return (
    <div
      className="cursor-pointer p-4 pl-0 text-2xl font-bold text-stone-800"
      onClick={() => navigate('/')}
    >
      <div className="-mb-2">Capacity</div>
      <div>Craft</div>
    </div>
  );
};

export default Logo;
