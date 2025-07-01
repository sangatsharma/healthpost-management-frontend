export function ThemeScript() {
  return (
    <script
      defer
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            var savedTheme = localStorage.getItem('theme');
            var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            var theme = savedTheme || (systemDark ? 'dark' : 'light');
            if (theme === 'dark') {
              document.documentElement.classList.add('dark');
            }
          })();
        `,
      }}
    />
  );
}
