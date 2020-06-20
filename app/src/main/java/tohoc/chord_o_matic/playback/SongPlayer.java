package tohoc.chord_o_matic.playback;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

import tohoc.chord_o_matic.R;
import tohoc.chord_o_matic.selection.SongChord;
import tohoc.chord_o_matic.selection.SongChordAdapter;

public class SongPlayer extends Fragment
{


    public SongPlayer()
    {
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState)
    {
        View tabSongComposer = inflater.inflate(R.layout.tab_song_playback, container, false);

        return tabSongComposer;
    }

}
