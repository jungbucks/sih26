// 헤더의 '레이트 바이브 코딩?' 버튼 → 설명 모달 (목록·작품 화면 공용)
const dialog = document.getElementById("about");
document.getElementById("about-open").addEventListener("click", () => {
  dialog.showModal();
  dialog.scrollTop = 0; // 항상 제목부터 보이게
});
dialog.querySelector(".about-close").addEventListener("click", () => {
  dialog.close();
});
// 모달 바깥(어두운 배경)을 누르면 닫는다. Esc 키는 브라우저가 처리한다
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) dialog.close();
});
