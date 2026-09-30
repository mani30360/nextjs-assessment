interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="header">
      <div className="container header__inner">
        <span className="header__title">{title}</span>
      </div>
    </header>
  );
}
