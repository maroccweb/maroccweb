var commonAcrossPages = {
            "isLoggedIn" : 1,
            "pushStateUrl": "home",
            "siteUrl" : "https://www.skylom.com",
            "pageType" : "home",
            "pagesToLoad" : "videos,winners,prizes",
        };
        $(document).ready(function () {
        $(".check-email-invite-valid-submit").click(function (e) {

            e.preventDefault();
            var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            var email = $(".check-email-invite-valid").val();
            var litmus = re.test(email);
            if (litmus != false) {
                $(".alreadyerror").show();
                $(".alreadyerror p").html('<img src="https://d2yyng880qrtaf.cloudfront.net/frontend/images/Rolling.gif?bulkversion=6&v=1513332862" width="30">');
                $.ajax({
                    type: "POST",
                    url: "https://www.skylom.com/check-already-member",
                    data: {
                        email: email,
                        "_token": "87dAuEX0LvH3BWbbtiSEys7rmbFJP6nvNBuj8hFJ"
                    },
                    success: function (result) {
                        if (result.valid) {
                            $(".request-invite-valid-form").submit();
                        }
                        else {
                            $(".alreadyerror").show();
                            $(".alreadyerror p").html('Hi! You are already a member. Sign in with facebook.');
                            $(".check-email-invite-valid").val('');
                        }
                    }
                });


            } else {
                alert("Please enter a valid email address.");
            }
        });
        $(".check-email-valid-e-custom").click(function (e) {
            e.preventDefault();
        })


    })

    $(document).ready(function() {

        /* for mobile menu */
        $('.nav-togal-icon').click(function () {
            $(this).toggleClass("is-active");
            var el = $("body");
            if (el.hasClass('toggled-left')) el.removeClass("toggled-left");
            else el.addClass('toggled-left');
            return false;
        });

        $('body').click(function(){
            if($('body').hasClass('toggled-left')){
                $('.nav-togal-icon').removeClass("is-active");
                $('body').removeClass('toggled-left');
            }
        });

        $('.navigation').click(function(e){
            e.stopPropagation();
        });
    })
    
    
    
