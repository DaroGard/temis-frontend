import { Link, useRouter } from '@tanstack/react-router';

interface NavLinkProps {
  to: string;
  label: string;
  onClick?: (e: React.MouseEvent) => void;
  isActive?: boolean;
}

const NavLink = ({ to, label, onClick, isActive: forcedIsActive }: NavLinkProps) => {
  const router = useRouter();
  const currentPath = router.state.location.pathname;
  const currentHash = router.state.location.hash;

  const [targetPath, targetHash] = to.split('#');

  const internalIsActive =
    currentPath === targetPath &&
    (targetHash ? currentHash === `#${targetHash}` : !currentHash);

  const isActive = forcedIsActive ?? internalIsActive;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`px-3 py-2 rounded-md text-lg font-medium transition-all duration-300 ease-in-out ${isActive
          ? 'text-white underline font-bold'
          : 'text-secondary hover:text-white hover:underline hover:font-bold'
        }`}
    >
      {label}
    </Link>
  );
};

export default NavLink;