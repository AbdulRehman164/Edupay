function getDomain(pathname) {
    if (pathname.startsWith('/hr')) return 'hr';
    if (pathname.startsWith('/accounts')) return 'accounts';
    if (pathname.startsWith('/admin')) return 'admin';
    return null;
}

export default getDomain;
