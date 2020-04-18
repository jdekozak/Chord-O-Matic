package tohoc.chord_o_matic.selection;

import android.os.Build;

import androidx.annotation.RequiresApi;

import java.util.Objects;

public class SongChord {

    public SongChord(String name)
    {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SongChord songChord = (SongChord) o;
        return name.equals(songChord.name);
    }

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @Override
    public int hashCode() {
        return Objects.hash(name);
    }

    public String name;
}
