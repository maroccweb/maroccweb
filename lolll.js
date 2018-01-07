    function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n :  n + new Array(width - n.length + 1).join(z) ;
    }


    setTimeout(function() {
        var fbLoginInterval = "";
        window.fbAsyncInit = function () {
            FB.init({
                appId: '1755412534500186',
                autoLogAppEvents: true,
                xfbml: true,
                version: 'v2.9'
            });
            if (!phpToJsData.isLoggedIn) {
                fbLoginInterval = setInterval(function () {
                    FB.getLoginStatus(function (response) {
                        if (response.status === 'connected') {
                            clearInterval(fbLoginInterval);
                            window.location = phpToJsData.siteUrl + "/fb-login";
                        } else {
                        }
                    });
                }, 50000)
            }
            FB.AppEvents.logPageView();
        };

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }, 5000)


    var nextFocus = '';
    var focusedInput = '';
    var canEnter = 1;
    $(document).ready(function() {


        if (phpToJsData.showLogin) {
            showLoginPop();
        }
        if(phpToJsData.showExceededLimit) {
            showLoginPop("");
            setTimeout(function() {
                hideLoginPop();
                window.location = phpToJsData.siteUrl + "/";
            }, 10000);
        }

        $('.submit-btn').click(function(event){

            if (!phpToJsData.isLoggedIn){
                showLoginPop();
                return false;
            }

            var i=0;
            var tN = '';
            var value = '';
            ticket = $('[name^="t"]').each(function() {
                value = $(this).val()+'';
                tN = tN.concat(value);
                if($(this).val())
                    i++;
            });
            var minValue = pad(1, $("#pick_type").val());
            var maxValue = pad(10, parseInt($("#pick_type").val())+1) - 1;

            if (tN) {
                if (parseInt(tN) < parseInt(minValue)) {
                    alert("Invalid number, please enter number between " + minValue + " and " + maxValue);
                    return false;
                }
            } else {
                alert("Please select your number!");
                return false;
            }

            $("#submitting").show();
            $(".button-wrap").hide();
            $(".block-heading").html('');

            $.ajax({
                type: "POST",
                url: "https://www.skylom.com/submit-number",
                data: {
                    number: tN,
                    campaignId: $("#campaign_id").val(),
                    "_token": "87dAuEX0LvH3BWbbtiSEys7rmbFJP6nvNBuj8hFJ"
                },
                success: function (result) {
                    if (result.error)
                    {
                        alert(result.error_message);
                        $("#submitting").hide();
                        $(".button-wrap").show();
                        location.reload();
                        $('[name^="t"]').each(function () {
                            $(this).val('');
                        });
                    }
                    else {
                        hasSubmittedInDraw = 1
                        canEnter = 0;
                        userHasEntry = 1;
                        userSubmittedNumber = tN;
                        disableGame();
                        $("#submitting").hide();
                        $("#submitted").show();
                        $("#coin_count").html(result.coins);
                        $('[name^="t"]').each(function () {
                            $(this).prop('disabled', true);
                        });
                    }
                },
                error: function (request, status, error) {
                    location.reload();
                }
            });


        })

        $(".input-circle").keypress(function (e) {
            //if the letter is not digit then display error and don't type anything
            if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                //display error message
                return false;
            }
        });

        $(".sel-numb").click(function(event) {
            if (canEnter)
            {
                var value = $(this).val();
                if (!nextFocus)
                    focusedInput = $("#t1");
                else
                    focusedInput = nextFocus;

                focusedInput.val(value);
                nextFocus = focusedInput.parent().next().find('input');
                if (nextFocus.get(0)) {
                    /*nextFocus.focus();*/
                }
                else
                    nextFocus = '';

                var tmp = [];
                $('[name^="t"]').each(function () {
                    tmp.push($(this).val());
                });
                $('[name^="t"]').each(function () {
                    $(this).prop('disabled', true);
                });
                $('.key-buttons').each(function () {
                    if (tmp.indexOf($(this).val()) >= 0) {
                        $(this).prop('disabled', true);
                        $(this).css('background-color', '#DEDEDE');
                    }
                });

            }
        });
    })

    function checkUserEntry()
    {
        $.ajax({
            type: "POST",
            url: "https://www.skylom.com/user-campaign-entry",
            data: {
                campaignId: $("#campaign_id").val(),
                "_token": "87dAuEX0LvH3BWbbtiSEys7rmbFJP6nvNBuj8hFJ"
            },
            success: function (result) {

                if (result.entered_number) {
                    userHasEntry = 1;
                    disableGame();
                    canEnter = 0;

                    var entered_number = new String(result.entered_number);
                    entered_number = entered_number.replace(/ +/g, "");
                    var j =0;
                    userSubmittedNumber = entered_number;
                    for (var i = 0; i < entered_number.length; i++) {
                        j = parseInt(i) + parseInt(1);
                        $("#t"+ j).val(entered_number.charAt(i));
                    }
                    $('[name^="t"]').each(function () {
                        $(this).prop('disabled', true);
                    });
                    $(".block-heading").html('');
                }
                else {
                    userHasEntry = 0;
                }
            },
            error: function (request, status, error) {
                location.reload();
            }
        });
    }

    function disableGame()
    {
        canEnter = 0;
        $(".button-wrap").hide();
        $('button.crcle-num').each(function() {
            $(this).prop('disabled', true);
            $(this).css('background-color' , '#7AC9F3');
        });
    }

    function showCircls(winners,userinput)
    {
        var pick_type = $("#pick_type").val();
        var i=1;
        $("#winning_number_disp").html('');
        $("#user_input_circle").html('');
        for(i=1;i<=pick_type;i=i+1)
        {
            if (winners) {
                $("#winning_number_disp").append('<li><span class="crcle-num big-crcle" id="win_' + i + '" >?</span></li>');
            }
            if (userinput) {
                $("#user_input_circle").append('<li><input type="text" id="t'+i+'"  name="t[]" class="input-circle" maxlength="1" ></li>');
                $(".input-circle").keypress(function (e) {
                    //if the letter is not digit then display error and don't type anything
                    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                        //display error message
                        return false;
                    }
                });
            }
        }
    }

    function showDrowWinningData(winners_count, winning_number)
    {
        showCircls(1,1);
        disableGame();
        var winners_url = '<a href="javascript:" style="color:#fff" onclick="winners('+ $("#campaign_id").val() +');"  >' + winners_count + ' WINNERS</a>';
        $(".total_winners").html(winners_url);
        $(".total_winners").show();

        winning_number = new String(winning_number);
        winning_number = winning_number.replace(/ +/g, "");

        var j =0;

        for (var i = 0; i < winning_number.length; i++) {
            j = parseInt(i) + parseInt(1);
            $("#win_"+ j).html(winning_number.charAt(i));
        }

        /*removing timer an showiw next draw time*/
        $(".timr").hide();
        var remtime = 0;
        setTimeout(function(){
            firebase.database().ref('t').once('value').then(function(snapshot) {
                remtime = snapshot.val();
                console.log(remtime);
                var waiting_time = 0;
                if (userHasEntry==1 && $("#campaign_status").val()==1){
                    waiting_time = parseInt($("#waiting_time").val()) + parseInt(remtime);
                }
                else{
                    waiting_time = parseInt(remtime) ;
                }

                $(".block-heading").html("NEXT DRAW IN <span id='nextdraw'>"+waiting_time+"</span>");
                timer(waiting_time,$('#nextdraw'));

            });
        }, 1000);
        /********/
        if (userHasEntry==1) {
                var timerInfo = Math.floor(Math.random() * 4000) + 1;
            setTimeout(function(){
                $.ajax({
                    type: "POST",
                    url: "https://www.skylom.com/user-campaign-winning-amount",
                    data: {
                        campaignId: $("#campaign_id").val(),
                        "_token": "87dAuEX0LvH3BWbbtiSEys7rmbFJP6nvNBuj8hFJ"
                    },
                    success: function (result) {

                        var cur_balance = parseFloat($("#balance").html()).toFixed(4);
                        cur_balance = parseFloat(cur_balance) + parseFloat(result.amount);
                        $("#balance").html(cur_balance.toFixed(4));


                        if (result.amount > 0) {
                            $(".you_won").html('YOU WON $' + result.amount + '!');
                            $(".you_won").show();
                        } else {
                            $(".you_won").html('YOU DIDN\'T WIN!');
                            $(".you_won").show();
                        }

                    },
                    error: function (request, status, error) {
                        location.reload();
                    }
                });},timerInfo);
        }

    }

    function drawInProgress()
    {
        $(".total_winners").hide();
        $("#submitted").hide();
        $(".you_won").hide();
        canEnter = 1;
        $(".button-wrap").show();
        $(".timr").show();
        $(".block-heading").html('PICK YOUR NUMBERS');
        $('button.crcle-num').each(function() {
            $(this).prop('disabled', false);
            $(this).css('background-color' , '#EAF3FC');
        });
        $('big-crcle').each(function() {
            $(this).html('?');
        });

        firebase.database().ref('t').once('value').then(function(snapshot) {
            timer(snapshot.val(),$('.timer-count'));
        });

        showCircls(1,1);
    }

    function timer(timeleft, element)
    {
        clearInterval(downloadTimer);
        downloadTimer = setInterval(function(){
            timeleft--;
            if (timeleft < 0){
               // $(".timr").hide();
            } else {
                $(element).html(timeleft);
            }
            if(timeleft <= 0) {
                clearInterval(downloadTimer);
            }
        },1000);
    }

    function showLoginPop(redirectUrl) {
        $("#myModal").modal("show");
        if(typeof redirectUrl != "undefined") {
            $(".login-popup-login-url").attr("href",phpToJsData.siteUrl + "/fb-login?redirect_url=" + redirectUrl);
        }
    }
    function hideLoginPop() {
        $("#myModal").modal("hide");
    }
