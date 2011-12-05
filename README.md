# ttTools
## All the stuff you wish turntable.fm already had.

ttTools provides the tools you need to use turntable.fm in the way you want to use it. It removes some restrictions and adds several new features. The idea behind this project was to highlight failures in turntable.fm and provide both incentive as well as relevant code snippets to incentivize implementing a proper solution while allowing us, the users, to enjoy a less restricted service in the interim.

# Features
## Disable Idle Timer
The idle timer is a local timer written in javascript and is used to do things like idle-kick a user from a room or a DJ spot. Because this is implement client-side, we can nueter it.

## Auto DJ w/ switch, variable delay and auto-off
The "holy grail" of turntable.fm features, everyone wants autoDJ to combat all the private autoDJ scripts that already exist. In the early days this wasn't necessary due to the fact that turntable.fm was not well known. As time has progressed, several rooms have had to implement their own third-party bots to enforce their third-party DJ queues and combat autoDJ scripts, but it's high time for a real DJ queue.

### Notes:
<ul>
	<li>Adds "DJ Next" jquery UI checkbox above the playlist, defaults to off.</li>
	<li>Has a default delay of 2 seconds, can be adjusted by clicking the "wrench" button above the playlist.</li>
	<li>When active, it will not autoDJ when you are the DJ that stepped down.</li>
	<li>Upon success, it will automatically disable so you don't keep hopping up if you're forced down.</li>
</ul>

### To use:
<ul>
	<li>Click the "DJ Next" checkbox above the playlist.</li>
</ul>

## Auto Awesome w/ switch & variable delay
Another highly requested feature, autoAwesome has the effect of resetting the idle timer server-side and generally contributes to the community. Everyone loves getting their songs upvoted.

### Notes:
<ul>
	<li>Adds "Up-Vote" jquery UI checkbox above the playlist, defaults to off.</li>
	<li>Has a default delay of 30 seconds, can be adjusted by clicking the "wrench" button above the playlist.</li>
</ul>

### To use:
<ul>
	<li>Click the "Up-Vote" checkbox above the playlist.</li>
</ul>

## Playlist Song Tagging & Filtering
This feature was inpired by [Turntable Extended](https://github.com/MarkReeder/Turntable.fm-Extensions 'Turntable Extended'). I really liked the idea, but being a minimalist, I disliked the UI, so I wrote my own implementation.

### Notes:
<ul>
	<li>Uses HTML5 web databases.</li>
	<li>When songs are deleted, their tags are not. If you later re0-add a song that you deleted, it will still have your tags.</li>
</ul>

### To use:
<ul>
	<li>Click a song in your playlist to add or remove tags.</li>
	<li>Once you have tagged songs, you can filter your queue based on your tags using the "filter songs in queue" input.</li>
	<li>You can reset your tags database by clicking the "Reset Tags Database" link at the bottom of the add/remove tags dialog.</li>
</ul>

## Playlist Invert & Shuffle
I've personally always wanted this feature. Sometimes you just want to mix it up.

### Notes
<ul>
	<li>Adds "Flip Playlist" jquery UI button above the playlist.</li>
	<li>Adds "Shuffle Playlist" jquery UI button above the playlist.</li>
</ul>

### To use:
<ul>
	<li>Click the "Flip Playlist" or "Shuffle playlist" button above the playlist.</li>
</ul>

## Download Songs
Self explanatory.

### Notes
<ul>
	<li>Adds "Download" icon, replacing the rdio icon when you hover over the LED billboard thing.</li>
</ul>

### To use:
<ul>
	<li>When a song is playing, hover overthe LED billboard thing, right click the "Download" icon, click Save-As.</li>
</ul>

## Disable DMCA Mute
Allows you to listen to your playlist when alone in a turntable.fm room. Useful when tagging or managing your queue.

### Notes
<ul>
	<li>Is activated automatically when you load the plugin.</li>
</ul>

### To use:
<ul>
	<li>Enter an empty room, load teh script, start DJing.</li>
</ul>

# To use:
Create a bookmark named ttTools, for the location enter:
	javascript:(function(){$.getScript('https://raw.github.com/egeste/ttTools/master/ttTools.js');})();

# Who to blame:
> Steve Regester
> egeste@egeste.net
> http://www.egeste.net/
> http://www.linkedin.com/in/egeste
