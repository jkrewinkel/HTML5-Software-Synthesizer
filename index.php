<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">

    <title>Synth</title>
    <meta name="description" content="A softsynth created in HTML5">
    <meta name="author" content="Jiri Krewinkel">

    <link rel="stylesheet" href="public/styles.css">
    <style>@import 'https://fonts.googleapis.com/css?family=Montserrat:400,700|Raleway:400,700';</style>

    <!--[if lt IE 9]>
    <!-- Add IE script here
    <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
</head>

<body>

<div id="container">
    <header>
        <h1>HTML5 Software Synthesizer</h1>
        <h2>By Jiri Krewinkel</h2>
        <p>Made as a portfolio piece to showcase my front-end and Javascript skills, this widget uses the HTML5 Web Audio API. No external libraries were used. You can view the source code on <a href="http://github.com/jkrewinkel">my Github profile</a>.</p>
    </header>

    <!-- Synth -->
    <main role="main">

        <div style="display: none;">
            <img src="public/img/square.svg">
            <a id="play">Play</a>
            <a id="stop">stop</a>
        </div>

        <!-- Keyboard -->
        <section id="input">
            <div class="shadow"></div>
            <ul id="keyboard">
                <?php

                $keys = ['f', 'f#', 'g', 'g#', 'a', 'a#', 'b', 'c', 'c#', 'd', 'd#', 'e'];
                $halfSteps = -16;
                for( $i = 1; $i < 3; $i++ ) {
                    foreach ($keys as $key) {
                        print('<li data-key="' . $key . '" data-half="'. $halfSteps .'"><span>'. $key .'</span></li>');
                        $halfSteps++;
                    }
                }

                ?>
            </ul>
            <div id="octave-ctrl">
                Octave
                <i class="icon-chevron-left" data-ctrl="octave-left" data-tt="Shift the keyboard an octave to the left, playing lower notes."></i>
                <i class="icon-chevron-right" data-ctrl="octave-right" data-tt="Shift the keyboard an octave to the right, playing higher notes"></i>
            </div>
        </section>

        <!-- End of Keyboard -->
    </main>
    <!-- End Synth -->

</div>

<script src="public/js/main.js"></script>

</body>
</html>