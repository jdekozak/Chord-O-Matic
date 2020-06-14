package tohoc.chord_o_matic.selection;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import java.util.ArrayList;

import tohoc.chord_o_matic.R;

public class ChordSelector extends Fragment
        implements ChordAdapter.OnChordListener,
                   SongChordAdapter.OnSongChordListener,
                   KeyAdapter.OnKeyListener
{
    private KeyAdapter keyAdapter;
    private RecyclerView keyView;
    private ArrayList<Key> keyCollection;
    private int selectedKey = 0;

    private ArrayList<Chord> chordCollection;
    private RecyclerView chordView;
    private ChordAdapter chordAdapter;

    private RecyclerView songChordView;
    private SongChordAdapter songChordAdapter;

    private OnChordSelectorListener chordSelectorListener;

    public interface OnChordSelectorListener
    {
        void onSuccessfulOperation();
    }

    public ChordSelector(OnChordSelectorListener chordSelectorListener)
    {
        this.chordSelectorListener = chordSelectorListener;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState)
    {
        View tabChordSelector = inflater.inflate(R.layout.tab_chord_selector, container, false);
        initializeKeyCollection();
        initializeKeyAdapter();
        initializeKeyView(tabChordSelector);

        initializeChordCollection();
        initializeChordAdapter();
        initializeChordView(tabChordSelector);

        initializeSongChordAdapter();
        initializeSongChordView(tabChordSelector);

        return tabChordSelector;
    }

    private void initializeKeyCollection()
    {
        keyCollection = new ArrayList<>();
        keyCollection.add(new Key("A"));
        keyCollection.add(new Key("Ab"));
        keyCollection.add(new Key("B"));
        keyCollection.add(new Key("Bb"));
        keyCollection.add(new Key("C"));
        keyCollection.add(new Key("C#"));
        keyCollection.add(new Key("D"));
        keyCollection.add(new Key("E"));
        keyCollection.add(new Key("Eb"));
        keyCollection.add(new Key("F"));
        keyCollection.add(new Key("F#"));
        keyCollection.add(new Key("G"));
    }

    private void initializeKeyAdapter()
    {
        keyAdapter = new KeyAdapter(keyCollection, this);
    }

    private void initializeKeyView(View parent)
    {
        keyView = parent.findViewById(R.id.list_of_keys);
        keyView.setLayoutManager(new GridLayoutManager(getContext(), 6));
        keyView.setAdapter(keyAdapter);
    }

    private void initializeChordCollection()
    {
        chordCollection = new ArrayList<>();
    }

    private void initializeChordAdapter()
    {
        chordAdapter = new ChordAdapter(chordCollection, this);
    }

    private void initializeChordView(View parent)
    {
        chordView = parent.findViewById(R.id.list_of_chords);
        chordView.setLayoutManager(new GridLayoutManager(getContext(), 3));
        chordView.setAdapter(chordAdapter);
    }

    private void initializeSongChordAdapter()
    {
        songChordAdapter = new SongChordAdapter(new ArrayList<SongChord>(), this);
    }

    private void initializeSongChordView(View parent)
    {
        songChordView = parent.findViewById(R.id.list_of_song_chords);
        songChordView.setLayoutManager(new LinearLayoutManager(getContext(), LinearLayoutManager.HORIZONTAL, false));
        songChordView.setAdapter(songChordAdapter);
    }

    private void notifyUserOfSuccessfulOperation()
    {
        chordSelectorListener.onSuccessfulOperation();
    }

    @Override
    public void onChordClick(int position)
    {
        SongChord songChord = new SongChord(keyCollection.get(selectedKey).name, chordCollection.get(position).suffix);
        if(!songChordAdapter.hasSongChord(songChord))
        {
            songChordAdapter.addSongChord(songChord);
            notifyUserOfSuccessfulOperation();
        }
    }

    @Override
    public void onSongChordClick(int position)
    {
        songChordAdapter.removeSongChord(position);
        notifyUserOfSuccessfulOperation();
    }

    @Override
    public void onKeyClick(int position)
    {
        selectedKey = position;

        clearChordCollection();
        loadChordCollection();

        notifyUserOfSuccessfulOperation();
    }

    private void loadChordCollection()
    {
        chordCollection.add(new Chord("m", new char[]{'x', '3', '2', '0', '1', '0'}, 0));
        chordCollection.add(new Chord("11", new char[]{'0','3','2','0','x','x'}, 0));
        chordCollection.add(new Chord("m7", new char[]{'x', '2', '2', '0', '1', '0'}, 2));
        chordCollection.add(new Chord("m9", new char[]{'0','3','2','0','x','x'}, 0));
        chordCollection.add(new Chord("major", new char[]{'5', '7', '7', '5', '6', 'x'}, 5));
        chordCollection.add(new Chord("dim7", new char[]{'0','2','2','0','0','x'}, 2));
        chordCollection.add(new Chord("aug9", new char[]{'8','a','8','9','a','8'}, 8));
        chordCollection.add(new Chord("m9bis", new char[]{'0','3','2','0','x','x'}, 0));
        chordCollection.add(new Chord("majbis", new char[]{'x', '3', '2', '0', '1', '0'}, 0));
        chordCollection.add(new Chord("dim7bis", new char[]{'0','3','2','0','x','x'}, 0));
        chordCollection.add(new Chord("aug9bis", new char[]{'x', '3', '2', '0', '1', '0'}, 0));
        chordCollection.add(new Chord("m9ter", new char[]{'0','3','2','0','x','x'}, 0));
        chordCollection.add(new Chord("majter", new char[]{'x', '3', '2', '0', '1', '0'}, 0));
        chordCollection.add(new Chord("dim7ter", new char[]{'0','3','2','0','x','x'}, 0));
        chordCollection.add(new Chord("aug9ter", new char[]{'x', '3', '2', '0', '1', '0'}, 0));
        chordAdapter.notifyDataSetChanged();
    }

    private void clearChordCollection()
    {
        chordCollection.clear();
        chordAdapter.notifyDataSetChanged();
    }
}
