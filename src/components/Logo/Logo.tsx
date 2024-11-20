import { useNavigate } from 'react-router-dom';

const Logo = () => {
  const navigate = useNavigate();

  const handleClick = () => navigate('/');
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') navigate('/');
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="cursor-pointer p-4 pl-0 text-2xl font-bold text-stone-800"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="-mb-2">Capacity</div>
      <div>Craft</div>
    </div>
  );
};

export default Logo;
