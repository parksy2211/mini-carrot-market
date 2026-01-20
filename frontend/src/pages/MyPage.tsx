export default function MyPage() {
  return (
    <section>
      <div className="pageHeader">
        <h1 className="pageTitle">마이페이지</h1>
        <p className="pageDesc">여기는 추후 프로필/내 상품/찜/거래내역 등을 넣을 수 있어요</p>
      </div>

      <div className="emptyPanel">
        <div className="emptyIcon">👤</div>
        <div className="emptyTitle">마이페이지 준비 중</div>
        <div className="emptyDesc">
          추천 구성: 프로필, 내 판매글, 찜 목록, 거래내역, 로그아웃
        </div>
        <div className="emptyHint">
          JWT 연동 후 “내 정보 조회 API” 붙이면 여기부터 완성하면 됩니다.
        </div>
      </div>
    </section>
  );
}
