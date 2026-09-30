"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAuthUser, selectCartTotalQuantity } from "@/store/selectors";
import { logout } from "@/store/slices/authSlice";

export default function Header() {
  const user = useAppSelector(selectAuthUser);
  const cartCount = useAppSelector(selectCartTotalQuantity);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    await dispatch(logout());
    router.replace("/login");
    router.refresh();
  };

  return (
    <header className="header">
      <div className="container header__inner">
        <Link href={user ? "/products" : "/login"} className="header__title">
          ShopDemo
        </Link>

        {user && (
          <nav className="header__nav" aria-label="Main">
            <Link href="/products" className="header__link">
              Products
            </Link>
            <Link href="/cart" className="header__link header__cart">
              Cart
              <span className="badge" aria-label={`${cartCount} items in cart`}>
                {cartCount}
              </span>
            </Link>
            <span className="header__user" title={user.email}>
              {user.email}
            </span>
            <button type="button" className="btn btn--ghost" onClick={handleLogout}>
              Log out
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
