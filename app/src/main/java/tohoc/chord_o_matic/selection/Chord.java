package tohoc.chord_o_matic.selection;

public class Chord
{
    public Chord(String suffix, char[] frets, int barre)
    {
        this.suffix = suffix;
        this.frets = frets;
        this.barre = barre;
    }

    public String suffix;
    public char[] frets;
    public int barre;
}
