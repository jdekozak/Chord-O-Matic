package tohoc.chord_o_matic.composition;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import tohoc.chord_o_matic.R;

public class SongComposer extends Fragment
{
    public SongComposer()
    {
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState)
    {
        View tabSongComposer = inflater.inflate(R.layout.tab_song_composer, container, false);
        return tabSongComposer;
    }
}
