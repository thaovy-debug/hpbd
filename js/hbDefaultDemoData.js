/**
 * Dữ liệu mẫu đầy đủ (album, thư, nhạc, món quà cuối) — dùng cho ?mode=demo
 */
(function (global) {
  function getDefaultDemoData() {
    return {
      intro: {
        recipientName: "My Love",
      },
      music: {
        tracks: [
          "./assets/audios/Số 1 Thế Giới-[AudioTrimmer.com].mp3",
        ],
        selectedTrackUrl:
          "./assets/audios/Số 1 Thế Giới-[AudioTrimmer.com].mp3",
      },
      book: {
        images: [
          { url: "./assets/images/anh1.jpg", alt: "Ảnh album 1" },
          { url: "./assets/images/anh2.jpg", alt: "Ảnh album 2" },
          { url: "./assets/images/anh3.jpg", alt: "Ảnh album 3" },
          { url: "./assets/images/anh4.jpg", alt: "Ảnh album 4" },
          { url: "./assets/images/anh5.jpg", alt: "Ảnh album 5" },
          { url: "./assets/images/anh6.jpg", alt: "Ảnh album 6" },
        ],
      },
      letter: {
        title: "Anh yêu à,",
        body:
          "Hôm nay là 31/05, một ngày đặc biệt của anh - ngày mà anh xuất hiện trên thế giới này. Cũng là ngày của cả chúng ta, ngày mà chúng ta quyết định đến với nhau bằng tất cả những yêu thương. Tròn 3 năm ngày chúng ta bên nhau, 1097 ngày trải qua bao nhiêu vui, buồn, bao nhiêu cãi vã, nhưng đến giây phút này chúng ta vẫn quyết định đi cùng nhau.\n\n" +
          "Chúng ta đều vẫn còn nhỏ, nên đôi lúc có những cư xử, thái độ, lời nói chưa đúng đắn. Đôi khi em rất quá đáng, nhưng đó chỉ là lúc em nóng giận, nhiều lần em muốn chúng ta dừng lại, nhưng em biết bản thân mình thế nào, tình cảm em dành cho anh tới đâu, nên em nói ra những lời đó chỉ để xem anh có thương em không có giữ em lại hay không mà thôi, anh cũng cảm nhận và biết được rằng em chưa bao giờ làm như lời em nói được, em chưa bao giờ nghĩ sẽ bỏ anh lại. Sau tất cả, thứ em cần ở anh chỉ là sự yêu thương, cảm thông, hiểu em khi em khó chịu, thương em khi em giận, dỗ em khi em đau, lau nước mắt khi em khóc, ôm em khi em tủi.\n\n" +
          "Sau nhiều lời như vậy em chỉ muốn anh có một tuổi mới thật hạnh phúc và rực rỡ, muốn chúng ta có một hạnh phúc thật trọn vẹn, và sẽ có thật nhiều thật nhiều cái 3 năm hơn nữa.",
        signature: "Ngày ta nắm tay yêu công khai giữa đời\nLà ngày thế giới mất hai nỗi buồn\nCả kiếp này anh có được em là siêu đẳng cấp rồi.",
      },
      finalGift: {
        enabled: true,
        wishes: [
          "Happy Birthday 💕",
          "Yêu anh nhất ❤️",
          "Tuổi mới thật hạnh phúc 💖",
        ],
      },
    };
  }

  global.__HB_getDefaultDemoData = getDefaultDemoData;
})(typeof window !== "undefined" ? window : globalThis);
