import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { Member } from '../../../types/Member';

type OwnProps = {
  member: Member;
  onRemove: () => void;
};

type StateProps = {
  id: string;
};

type Props = OwnProps & StateProps;

const MemberCalendarHeadItem = ({ member, onRemove, id }: Props) => {
  const handleRemove = () => {
    if (id === member.id) return;
    onRemove();
  };

  return (
    <td
      className="group relative w-fit min-w-24 cursor-pointer overflow-visible p-2"
      onClick={handleRemove}
    >
      <span className="absolute opacity-100 transition-opacity duration-500 group-hover:invisible group-hover:opacity-0">
        {member.displayName}
      </span>
      <span className="invisible text-sm text-stone-500 underline opacity-0 transition-opacity duration-500 group-hover:visible group-hover:opacity-100">
        {id === member.id ? "It's you" : 'Remove'}
      </span>
    </td>
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  id: state.user.id ?? '',
});

export default connect(mapStateToProps)(MemberCalendarHeadItem);
