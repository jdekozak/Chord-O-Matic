package tohoc.chord_o_matic.composition;

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

public class SongComposer extends Fragment
        implements SongChordAdapter.OnSongChordListener
{
    private RecyclerView songChordView;
    private SongChordAdapter songChordAdapter;

    private ArrayList<SongChord> songChordCollection;

    public SongComposer()
    {
        initializeSongChordCollection();
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState)
    {
        View tabSongComposer = inflater.inflate(R.layout.tab_song_composer, container, false);

        initializeSongChordAdapter();
        initializeSongChordView(tabSongComposer);

        return tabSongComposer;
    }

    private void initializeSongChordCollection()
    {
        songChordCollection = new ArrayList<>();
        songChordCollection.add(new SongChord("A","maj"));
        songChordCollection.add(new SongChord("A", "min"));
        songChordCollection.add(new SongChord("B", "7"));
        songChordCollection.add(new SongChord("C", ""));
        songChordCollection.add(new SongChord("F", ""));
        songChordCollection.add(new SongChord("F","maj"));
        songChordCollection.add(new SongChord("G", ""));
    }

    private void initializeSongChordAdapter()
    {
        songChordAdapter = new SongChordAdapter(songChordCollection, this);
    }

    private void initializeSongChordView(View parent)
    {
        songChordView = parent.findViewById(R.id.list_of_song_chords);
        songChordView.setLayoutManager(new LinearLayoutManager(getContext(), LinearLayoutManager.HORIZONTAL, false));
        songChordView.setAdapter(songChordAdapter);
    }

    @Override
    public void onSongChordClick(int position)
    {

    }
}
