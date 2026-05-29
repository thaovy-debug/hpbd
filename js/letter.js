/**
 * Dữ liệu thư từ server (JSON). Ví dụ:
 * { "title": "...", "body": "...", "signature": "..." }
 * - body: mỗi lần xuống dòng sẽ tách thành một đoạn mới để hiển thị dễ đọc hơn.
 * - Mỗi đoạn là <p class="letter__paragraph">, .textContent để tránh XSS.
 */
function renderLetter(data) {
    var title = data && data.title != null ? String(data.title) : "";
    var body = data && data.body != null ? String(data.body) : "";
    var signature = data && data.signature != null ? String(data.signature) : "";
  
    $(".js-letter-title").text(title);
  
    var $bodyEl = $(".js-letter-body");
    $bodyEl.empty();
    var chunks = body.split(/\r?\n+/);
    for (var i = 0; i < chunks.length; i++) {
      var t = chunks[i].replace(/^\s+|\s+$/g, "");
      if (t === "") continue;
      var p = document.createElement("p");
      p.className = "letter__paragraph";
      p.textContent = t;
      $bodyEl.append(p);
    }
  
    $(".js-letter-signature").text(signature);
  }
  
  /**
   * Sau này thay bằng gọi API, ví dụ:
   * return fetch('/api/letter/123').then(function (r) {
   *   if (!r.ok) throw new Error(r.statusText);
   *   return r.json();
   * });
   */
  function startLetterFall($self) {
    if (
      $self.hasClass("letter-revealed-settling") ||
      $self.hasClass("letter-revealed-done")
    ) {
      return;
    }
    var card = $self.find(".envelope__card.open")[0];
    if (!card) {
      $self.addClass("letter-revealed-done");
      return;
    }
    $self.addClass("letter-revealed-settling");
    var fallTimer = window.setTimeout(function () {
      card.removeEventListener("animationend", onFallEnd);
      finishLetterFall($self);
    }, 1300);
  
    function onFallEnd(e) {
      if (e.target !== card) return;
      var name = (e.animationName || "").toLowerCase();
      if (name.indexOf("letterfall") === -1) return;
      window.clearTimeout(fallTimer);
      card.removeEventListener("animationend", onFallEnd);
      finishLetterFall($self);
    }
  
    card.addEventListener("animationend", onFallEnd);
  }
  
  function finishLetterFall($self) {
    var wrap = $self[0];
    if (wrap.classList && wrap.classList.replace) {
      wrap.classList.replace("letter-revealed-settling", "letter-revealed-done");
    } else {
      $self
        .addClass("letter-revealed-done")
        .removeClass("letter-revealed-settling");
    }
  }
  
  function loadLetter() {
    var previewLetter = window.__HB_PREVIEW_DATA?.letter;
    if (previewLetter) {
      return Promise.resolve({
        title:
          previewLetter.title != null ? String(previewLetter.title).trim() : "",
        body: previewLetter.body != null ? String(previewLetter.body) : "",
        signature:
          previewLetter.signature != null
            ? String(previewLetter.signature).trim()
            : "",
      });
    }
    return Promise.resolve({
      title: "Anh yêu à,",
      body:
        "Hôm nay là 31/05, một ngày đặc biệt của anh - ngày mà anh xuất hiện trên thế giới này. Cũng là ngày của cả chúng ta, ngày mà chúng ta quyết định đến với nhau bằng tất cả những yêu thương. Tròn 3 năm ngày chúng ta bên nhau, 1093 ngày trải qua bao nhiêu vui, buồn, bao nhiêu cãi vã, nhưng đến giây phút này chúng ta vẫn quyết định đi cùng nhau.\n\n" +
        "Chúng ta đều vẫn còn nhỏ, nên đôi lúc có những cư xử, thái độ, lời nói chưa đúng đắn. Đôi khi em rất quá đáng, nhưng đó chỉ là lúc em nóng giận, nhiều lần em muốn chúng ta dừng lại, nhưng em biết bản thân mình thế nào, tình cảm em dành cho anh tới đâu, nên em nói ra những lời đó chỉ để xem anh có thương em không có giữ em lại hay không mà thôi, anh cũng cảm nhận và biết được rằng em chưa bao giờ làm như lời em nói được, em chưa bao giờ nghĩ sẽ bỏ anh lại. Sau tất cả, thứ em cần ở anh chỉ là sự yêu thương, cảm thông, hiểu em khi em khó chịu, thương em khi em giận, dỗ em khi em đau, lau nước mắt khi em khóc, ôm em khi em tủi.\n\n" +
        "Sau nhiều lời như vậy em chỉ muốn anh có một tuổi mới thật hạnh phúc và rực rỡ, muốn chúng ta có một hạnh phúc thật trọn vẹn, và sẽ có thật nhiều thật nhiều cái 3 năm hơn nữa.",
      signature: "Ngày ta nắm tay yêu công khai giữa đời\nLà ngày thế giới mất hai nỗi buồn\nCả kiếp này anh có được em là siêu đẳng cấp rồi.",
    });
  }

  function isFinalGiftEnabled() {
    return !!window.__HB_PREVIEW_DATA?.finalGift?.enabled;
  }
  
  function whenGiftDataReady(done) {
    if (window.__HB_GIFT_LOAD_PROMISE) {
      window.__HB_GIFT_LOAD_PROMISE.finally(done);
    } else {
      done();
    }
  }

  $(function () {
    whenGiftDataReady(function () {
      loadLetter()
        .then(renderLetter)
        .catch(function () {
          renderLetter({
            title: "Không tải được thư",
            body: "Vui lòng thử lại sau.",
            signature: "",
          });
        });
    });

    function setImageFlyLoadProgress(p) {
      var bar = document.getElementById("imagefly-load-bar");
      var pctEl = document.getElementById("imagefly-load-pct");
      var n = Math.max(0, Math.min(100, Math.round(p)));
      if (bar) bar.style.width = n + "%";
      if (pctEl) pctEl.textContent = n + "%";
    }

    function enterImageFlyFromLetter() {
      document.body.classList.remove("scene-letters");
      document.body.classList.add("scene-imagefly");
      var panel = document.getElementById("image-fly-screen");
      var loadOverlay = document.getElementById("imagefly-load-overlay");
      if (panel) panel.hidden = false;
      if (loadOverlay) {
        loadOverlay.removeAttribute("hidden");
        loadOverlay.hidden = false;
        loadOverlay.setAttribute("aria-busy", "true");
        loadOverlay.setAttribute("aria-hidden", "false");
        setImageFlyLoadProgress(0);
      }
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          if (typeof window.initCakeFlyBackground === "function") {
            window.initCakeFlyBackground();
          }
          if (typeof window.initImageFlyScene === "function") {
            window.initImageFlyScene({
              onProgress: setImageFlyLoadProgress,
            });
          }
          window.dispatchEvent(new Event("resize"));
        });
      });
    }

    $(".js-letter-cake-fly").on("click keydown", function (event) {
      if (event.type === "keydown") {
        var key = event.key;
        if (key !== "Enter" && key !== " ") return;
      }
      var $env = $(this).closest(".js-open-envelope");
      if (!$env.find(".envelope").hasClass("open")) return;
      if (!isFinalGiftEnabled()) return;
      event.preventDefault();
      event.stopPropagation();
      // Chuyển sang màn hộp quà to
      document.body.classList.remove("scene-letters");
      document.body.classList.add("scene-biggift");
      var bigGiftPanel = document.querySelector(".panel--biggiftbox");
      if (bigGiftPanel) bigGiftPanel.hidden = false;
    });

    $("#big-present-img").on("click keydown", function(event) {
      if (event.type === "keydown") {
        var key = event.key;
        if (key !== "Enter" && key !== " ") return;
        event.preventDefault();
      }
      var $this = $(this);
      if ($this.hasClass("opened")) return;
      $this.addClass("opened");
      
      // Stop floating animation
      $this.css("animation", "none");
      
      // Zoom và biến mất hộp quà đóng
      $this.css({
        "opacity": "0",
        "transform": "scale(3)",
        "pointer-events": "none"
      });
      
      // Zoom và hiện lòng hộp quà mở (longhop.png)
      var $openImg = $("#big-present-open-img");
      $openImg.css({
        "opacity": "1",
        "transform": "scale(1)"
      });
      
      // Thêm hiệu ứng lơ lửng nhẹ cho lòng hộp sau khi mở
      setTimeout(function() {
        $openImg.css("animation", "floatBalloon 4s ease-in-out infinite");
      }, 1000);
      
      // Hiện ảnh của bạn bay lên từ lòng hộp
      setTimeout(function() {
        var $content = $("#big-gift-content");
        $content.css({
          "opacity": "1",
          "transform": "translate(-50%, -50%) scale(1)",
          "pointer-events": "auto"
        });
      }, 600);
    });
    
    // Make it keyboard accessible
    $("#big-present-img").attr({
      "tabindex": "0",
      "role": "button",
      "aria-label": "Mở hộp quà đặc biệt"
    });

    $("#btn-next-to-fly").on("click keydown", function(e) {
      if (e.type === "keydown") {
        var key = e.key;
        if (key !== "Enter" && key !== " ") return;
      }
      e.preventDefault();
      e.stopPropagation();
      document.body.classList.remove("scene-biggift");
      enterImageFlyFromLetter();
    });


    $(".js-open-envelope").on("click", function (event) {
      event.preventDefault();
      var $self = $(this);
      if ($self.find(".envelope").hasClass("open")) {
        return;
      }
      $self.find(".envelope").addClass("open");
      $self.find(".heart use").attr("xlink:href", "#icon-heart-broken");
      $self.find(".envelope__card").addClass("open");
      /* Căn giữa + rơi chồng thời gian (không chờ hết transition) để liền mạch */
      window.setTimeout(function () {
        $self.addClass("letter-revealed");
        window.setTimeout(function () {
          startLetterFall($self);
        }, 320);
      }, 1280);
    });
  });
