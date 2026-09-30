import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  children: ReactNode;
}

export default function Card({ title, children }: CardProps) {
  
  console.log("Card component rendered with title:", title);
  return (
    <section className="card">
      {title && <h2 className="card__title">{title}</h2>}
      
      <div className="card__body">{children}</div>
    </section>
  );
}
