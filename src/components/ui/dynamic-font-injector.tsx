'use client';

type TDynamicFontInjectorProps = {
  fontFamilyName: string;
  fontUrl: string;
  targetSelectorId: string;
};

export default function DynamicFontInjector({
  fontFamilyName,
  fontUrl,
  targetSelectorId,
}: TDynamicFontInjectorProps) {
  return (
    <style jsx global>{`
      @font-face {
        font-family: '${fontFamilyName}';
        src: url('${fontUrl}');
        font-display: swap;
      }
      #${targetSelectorId} {
        font-family: '${fontFamilyName}', sans-serif !important;
      }
    `}</style>
  );
}
