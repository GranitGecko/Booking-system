<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application rules
- Keep homepage and booking as separate TanStack routes, with booking draft state in a root-mounted React provider so route navigation preserves choices without persistent storage for this demo.
- Use installed Bootstrap grid CSS for layout and token-styled controls rather than Bootstrap color utilities, avoiding collisions with Tailwind semantic classes.
- Keep availability deterministic and entirely client-side; never send personal or payment information from the demo.
