interface SquareProps {
  isBlack: boolean;
  children: React.ReactNode;
  row: number;
  col: number;
}

const Square: React.FC<SquareProps> = ({ isBlack, children, row, col }) => {
  const style = {
    width: '60px',
    height: '60px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const onClick = () => {
    console.log('touched!!');
    console.log(row, col);
  };

  return (
    <div
      className={`${
        isBlack
          ? 'bg-[#769656] hover:bg-[#88ad62]'
          : 'bg-[#eeeed2] hover:bg-[#f7f7d9]'
      } cursor-pointer`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Square;
