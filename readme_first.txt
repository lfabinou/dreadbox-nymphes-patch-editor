Nymphes Patch-Editor

This is a crude start of a patch editor for the Nymphes synth by Dreadbox.

1) You need to use the Chrome Browser

2) Currently its supposed to work on a desktop browser - no mobile first layout, sorry!

3) The values initialy shown are just random settings and the sounds will produce jumps when you start using it.

4) The sliders and values will get properly setup as soon as you switch the patch on the Nymphes.

5) Tho all values on the editor get send correctly to the synth and can be stored there, at switching the patch on the Nymphes not all values get updated accordingly. 
   This seems to be a lack of parameters that are send to midi at switching the patch. Maybe a future Firmware-Update will fix that. I will keep an eye open for that.
   Up to now the full "responding" values are marked with an underscore.

   I checked in with Dreadbox - this is a quote of the very quick and polite reply i received: ".. We were thinking of cancelling completely the CC force send on load 
   and replace it with sysex so as it won't interfere with other units. We also hope to have a proper editor at some point soon which will enable you to import export 
   patches and control the whole synth virtually. Those two are going to happen at the same time so please be patient till the next update which will have some bug 
   fixes and some extra features! .."

   This way the editor will stop working sooner or later, but seems to be obsolete at that point in time, as they obviously plan on creating an editor themselves.

   Until then i m planing to make the patches "saveable" on the computer, most likely also in a very crude way, but it should provide an easy backup and reimport. Lets see
   how long it will take. ;-)

Disclaimer:

This was done for my own usage, but i thought some people might like to use it too. Using the editor is at your own risk. Tho i dont expect that any of these midi 
commands could brick the synth, i dont take responsibility for any damage you create by using this piece of software.

Last change: 28.12.2021