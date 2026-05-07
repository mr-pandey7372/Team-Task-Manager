const StatusBadge = ({ status }) => {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-800';

  if (status === 'Todo') {
    bgColor = 'bg-gray-100';
    textColor = 'text-gray-800';
  } else if (status === 'In Progress') {
    bgColor = 'bg-blue-100';
    textColor = 'text-blue-800';
  } else if (status === 'Done') {
    bgColor = 'bg-green-100';
    textColor = 'text-green-800';
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
