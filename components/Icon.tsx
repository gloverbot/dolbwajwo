/**
 * 구글 Material Symbols(Rounded) 아이콘을 보여주는 조각입니다.
 *
 * 쓰는 법:  <Icon name="home" className="text-2xl" />
 *   - name  : 구글 아이콘 이름 (https://fonts.google.com/icons 에서 검색)
 *   - filled: true면 속이 꽉 찬 모양, 없으면 선으로만 그린 모양
 *
 * 아이콘 크기는 '글자 크기'로 정해집니다. text-2xl 처럼 크기 클래스를 주세요.
 */
export function Icon({
  name,
  className = "",
  filled = false,
}: {
  name: string;
  className?: string;
  filled?: boolean;
}) {
  return (
    <span
      className={`material-symbols-rounded ${filled ? "icon-filled" : ""} ${className}`}
      aria-hidden
    >
      {name}
    </span>
  );
}
