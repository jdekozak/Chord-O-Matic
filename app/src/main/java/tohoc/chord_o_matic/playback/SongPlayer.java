package tohoc.chord_o_matic.playback;

import android.content.Context;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import tohoc.chord_o_matic.R;

public class SongPlayer extends Fragment
{
    MediaPlayer mediaPlayer;

    public SongPlayer(Context context)
    {
        mediaPlayer = MediaPlayer.create(context, R.raw.chord);
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState)
    {
        View tabSongPlayer = inflater.inflate(R.layout.tab_song_playback, container, false);

        Button buttonPlay = tabSongPlayer.findViewById(R.id.play);
        Button buttonPause = tabSongPlayer.findViewById(R.id.pause);
        buttonPlay.setOnClickListener(new Button.OnClickListener(){
            @Override
            public void onClick(View v) {
                if(!mediaPlayer.isPlaying())
                {
                    mediaPlayer.start();
                }
            }
        });
        buttonPause.setOnClickListener(new Button.OnClickListener(){
            @Override
            public void onClick(View v) {
                if(mediaPlayer.isPlaying())
                {
                    mediaPlayer.pause();
                }
            }
        });

        return tabSongPlayer;
    }

}
